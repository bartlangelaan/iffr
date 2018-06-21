/**
 * We fake the complete oauth flow. We do this until a real oauth provider
 * comes along.
 */
import login from '../services/tickettrigger/login';
import { tokenCrypto } from '../auth';
import { getClient } from '../clients';
import TimeClientBasedCrypto from '../utils/time-client-based-crypto';
import { getApiCodeSalt } from '../utils/environment';
import {
  Controller,
  Get,
  BadRequestException,
  Req,
  Res,
  Query,
  Body,
  Header,
  Post,
} from '@nestjs/common';

const codeCrypto = new TimeClientBasedCrypto(60, getApiCodeSalt());

@Controller('oauth2')
export class OAuth2Controller {
  /**
   * Users are redirected to this endpoint when they need to be authenticated.
   *
   * Documentation: https://www.oauth.com/oauth2-servers/authorization/the-authorization-request/
   */
  @Get('/auth')
  authorize(
    @Query('response_type') type: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    if (type !== 'code') {
      throw new BadRequestException('Response type must be code');
    }

    const url = getCallbackUrl(req, '/oauth2/tt-callback');

    res.redirect(login.getRedirectUrl(url));
  }

  /**
   * When the user is authenticated, it's redirected to this endpoint.
   * Here we extract the user id on the browser.
   */
  @Get('/tt-callback')
  authorizeCallback1(@Req() req: any) {
    const url = getCallbackUrl(req, '/oauth2/tt-callback2');
    return login.generatePageToGetUserUuid(url);
  }

  /**
   * When the user id is extracted, the user is redirected to this endpoint.
   * We get the user id and redirect users back to the client.
   */
  @Get('/tt-callback2')
  authorizeCallback2(
    @Query('error') error: string,
    @Query('user_uuid') user: string,
    @Query('state') state: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    // If the error parameter is availble, we show it to the user.
    if (error) {
      return `
      <h1>${error}</h1>
      <br />
      <a href="${getCallbackUrl(req, '/oauth2/auth')}">Try again.</a>
    `;
    }

    // Verify the request.
    if (!user) {
      throw new BadRequestException('user_uuid is required.');
    }
    const client = getClient(req);

    // Encrypt the user_uuid to an authorization code.
    const code = codeCrypto.encrypt(user, client);

    // Generate the url to redirect to.
    const url = new URL(client.redirect_uri);
    url.searchParams.set('code', code);
    if (state) {
      url.searchParams.set('state', state);
    }

    // Redirect the user.
    res.redirect(url.toString());
    return;
  }

  /**
   * On this endpoint, the authorization code can be exchanged for an access_token.
   *
   * Documentation:
   * https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/
   * https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
   */
  @Post('/token')
  @Header('Cache-Control', 'no-cache')
  @Header('Pragma', 'no-cache')
  getToken(
    @Body('grant_type') grantType: string,
    @Body('code') code: string,
    @Req() req: any,
  ) {
    if (grantType !== 'authorization_code') {
      throw new BadRequestException('grant_type must be authorization_code');
    }

    const client = getClient(req, true);

    // We decrypt the code, so we get the userUuid back.
    const { text: userUuid } = codeCrypto.decrypt(code, client);

    // We encrypt the code to an access token.
    const accessToken = tokenCrypto.encrypt(userUuid, client);

    return {
      token_type: 'bearer',
      access_token: accessToken,
    };
  }
}

/**
 * Utility function, returns the callback url based on query parameters that
 * it needs to pass on. Fails if the client can't be found.
 */
function getCallbackUrl(req: any, path: string) {
  const {
    headers: { host },
    query: { state },
    protocol,
  } = req;
  const client = getClient(req);

  const url = new URL(`${protocol}://${host}${path}`);
  url.searchParams.set('client_id', client.id);
  if (state) {
    url.searchParams.set('state', state);
  }

  return url.toString();
}
