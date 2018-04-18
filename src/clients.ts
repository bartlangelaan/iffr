import { IRouterContext } from 'koa-router';

export interface Client {
  // The id is a public identifier for this client.
  id: string;

  // The secret is a private identifier for this client. It's not required, but
  // it should be issued for server-side clients. When it's set, tokens are
  // only issued with the secret set. This is more secure then without.
  secret?: string;

  // This is the url where the user is redirected to after the user has been
  // authenticated.
  redirect_uri: string;

  // This is a private identifier for the client, that is used for encryption.
  // No-one should know this, not even the server of the client. We need this
  // because we need to be able to decrypt our tokens, and check if this token
  // was issued by this client.
  salt: string;
}

const CLIENTS: Client[] = [
  {
    id: 'website',
    redirect_uri: 'https://iffr.com/auth_callback',
    salt: '2349s9df92',
  },
];

/**
 * Utility function, gets the client object from the CLIENT array, based on the
 * request query.
 *
 * Fails the request if the client can't be found.
 */
export function getClient(ctx: IRouterContext, secretEnforced = false) {
  const { body } = ctx.request;
  const query =
    typeof body === 'object' && Object.keys(body).length ? body : ctx.query;
  const { client_id, client_secret } = query;

  // Find the client based on the client_id parameter.
  const client = CLIENTS.find(c => c.id === client_id);

  // If there is no client_id, throw.
  if (!client) {
    throw ctx.throw(400, 'client_id not found');
  }

  // If the secret is enforced and the client has a secret but it's not
  // sent, don't allow.
  if (secretEnforced && client.secret && !client_secret) {
    throw ctx.throw(400, 'client_secret is required for this client');
  }

  // If there is a client_secret, we verify that it's true (even when it's
  // not required).
  if (client_secret && client_secret !== client.secret) {
    throw ctx.throw(400, 'client_secret not correct');
  }

  return client;
}
