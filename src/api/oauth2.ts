/**
 * We fake the complete oauth flow. We do this until a real oauth provider
 * comes along.
 */
import * as Router from 'koa-router';
import { URL } from 'url';
import login from '../services/tickettrigger/login';
import { getClient, getClientBySecret, Client } from '../clients';
import TimeClientBasedCrypto from '../utils/time-client-based-crypto';
import { getApiTokenSalt, getApiCodeSalt } from '../utils/environment';

const codeCrypto = new TimeClientBasedCrypto(60, getApiCodeSalt());
const tokenCrypto = new TimeClientBasedCrypto(24 * 60 * 60, getApiTokenSalt());

const router = new Router({
  prefix: '/oauth2',
});

/**
 * Users are redirected to this endpoint when they need to be authenticated.
 *
 * Documentation: https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/
 */
router.get('authorize', '/auth', ctx => {
  const { response_type } = ctx.query;

  // Validate the request.
  if (response_type !== 'code') {
    throw ctx.throw(400, 'response_type must be code');
  }

  // Generate the url to redirect to after the login was successful.
  const url = getCallbackUrl(ctx, 'authorize-callback-1');

  // Redirect the user.
  ctx.redirect(login.getRedirectUrl(url));
});

/**
 * When the user is authenticated, it's redirected to this endpoint.
 * Here we extract the user id on the browser.
 */
router.get('authorize-callback-1', '/tt-callback', ctx => {
  // Generate the url to redirect to after the login was successful.
  const url = getCallbackUrl(ctx, 'authorize-callback-2');

  ctx.body = login.generatePageToGetUserUuid(url);
});

/**
 * When the user id is extracted, the user is redirected to this endpoint.
 * We get the user id and redirect users back to the client.
 */
router.get('authorize-callback-2', '/tt-callback2', async ctx => {
  const { error, user_uuid, state } = ctx.query;

  // If the error parameter is availble, we show it to the user.
  if (error) {
    ctx.body = `
      <h1>${error}</h1>
      <br />
      <a href="${getCallbackUrl(ctx, 'authorize')}">Try again.</a>
    `;
    return;
  }

  // Verify the request.
  if (!user_uuid) {
    throw ctx.throw(400, 'user_uuid is required');
  }
  const client = getClient(ctx);

  // Encrypt the user_uuid to an authorization code.
  const code = codeCrypto.encrypt(user_uuid, client);

  // Generate the url to redirect to.
  const url = new URL(client.redirect_uri);
  url.searchParams.set('code', code);
  if (state) {
    url.searchParams.set('state', state);
  }

  // Redirect the user.
  ctx.redirect(url.toString());
});

/**
 * On this endpoint, the authorization code can be exchanged for an access_token.
 *
 * Documentation:
 * https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/
 * https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
 */
router.post('/token', async ctx => {
  const { grant_type, code } = ctx.request.body;

  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Pragma', 'no-cache');

  if (grant_type !== 'authorization_code') {
    throw ctx.throw(400, 'grant_type must be authorization_code');
  }

  const client = getClient(ctx, true);

  // We decrypt the code, so we get the userUuid back.
  const { text: userUuid } = codeCrypto.decrypt(code, client);

  // We encrypt the code to an access token.
  const accessToken = tokenCrypto.encrypt(userUuid, client);

  ctx.body = {
    token_type: 'bearer',
    access_token: accessToken,
  };
});

export default router;

declare module 'koa-router' {
  interface IRouterContext {
    state: {
      userUuid: string | null;
      serverClient: boolean;
      permissions: string[];
      client: Client | null;
    };
  }
}

export function addAuthenticationState(
  ctx: Router.IRouterContext,
  next: () => void,
): void | never {
  const { authorization }: { authorization: string | undefined } = ctx.headers;
  const {
    access_token,
    client_secret,
  }: {
    access_token: string | undefined;
    client_secret: string | undefined;
  } = ctx.query;

  ctx.state.client = null;
  ctx.state.userUuid = null;
  ctx.state.serverClient = false;
  ctx.state.permissions = [];

  let token: string | null = null;

  if (access_token) {
    return ctx.throw(
      400,
      'Using access_token in the query is not supported. Use the authentication header.',
    );
  }
  if (authorization) {
    if (authorization.indexOf('Bearer ') !== 0) {
      return ctx.throw(400, 'Authentication header token type not supported.');
    }
    token = authorization.substr('Bearer '.length);
  }

  if (token) {
    try {
      const decrypted = tokenCrypto.decrypt(token);
      ctx.state.client = decrypted.client;
      ctx.state.userUuid = decrypted.text;
      ctx.state.serverClient = false;
      ctx.state.permissions.push(
        ...(decrypted.client.permissions.unsecure || []),
      );
    } catch (error) {
      return ctx.throw(403, error.message);
    }
  }

  if (client_secret) {
    const client = getClientBySecret(client_secret);
    if (!client) {
      return ctx.throw(403, 'Client with secret not found.');
    }
    ctx.state.serverClient = true;
    ctx.state.client = client;
    ctx.state.permissions.push(...(client.permissions.secure || []));
  }

  return next();
}

interface passtroughParams {
  client_id: string;
  state?: string;
}

/**
 * Utility function, returns the callback url based on query parameters that
 * it needs to pass on. Fails if the client can't be found.
 */
function getCallbackUrl(ctx: Router.IRouterContext, routerName: string) {
  const {
    request: { origin },
    query: { state },
  } = ctx;
  const client = getClient(ctx);

  const url = new URL(origin + router.url(routerName, {}));
  url.searchParams.set('client_id', client.id);
  if (state) {
    url.searchParams.set('state', state);
  }

  return url.toString();
}
