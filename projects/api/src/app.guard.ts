import {
  ReflectMetadata,
  Injectable,
  CanActivate,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getClientBySecret } from './clients';
import TimeClientBasedCrypto from './utils/time-client-based-crypto';
import { getApiTokenSalt, getApiCodeSalt } from './utils/environment';
import {
  ApiImplicitParam,
  ApiBearerAuth,
  ApiOAuth2Auth,
} from '@nestjs/swagger';

export const tokenCrypto = new TimeClientBasedCrypto(
  7 * 24 * 60 * 60,
  getApiTokenSalt(),
);

@Injectable()
export class ApplicationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    // First, get the permissions required for this method.
    const permissionsRequired: string[] = this.reflector.get(
      'permissionsRequired',
      context.getHandler(),
    );

    // If there are no permissions required, this method is open-access.
    if (!permissionsRequired) return true;

    // Get the request.
    const request = context.switchToHttp().getRequest();
    const { headers, params, query } = request;

    // To check the permissions, we need to know which client is requesting data
    // and if it is a client-to-server or server-to-server request.
    let client;
    let permissionsType: 'secure' | 'unsecure';
    let user: string | undefined;

    if (query.client_secret) {
      // Servers can use the ?client_secret= query parameter to authorize.
      client = getClientBySecret(query.client_secret);

      // If there is no client with that secret, return don't allow access.
      if (!client) return false;

      // This is a server-to-server request, so use the 'secure' permissions.
      permissionsType = 'secure';
    } else if (headers.authorization) {
      // If a client connects, it uses the 'Authentication: Bearer xxxx' header.
      if (headers.authorization.indexOf('Bearer ') !== 0) return false;
      const token = headers.authorization.substr('Bearer '.length);

      // Try to decrypt the token. If it fails, deny access.
      try {
        const decrypted = tokenCrypto.decrypt(token);
        client = decrypted.client;
        user = decrypted.text;
      } catch (e) {
        return false;
      }

      // This is a client-to-server request, so use the 'unsecure' permissions.
      permissionsType = 'unsecure';
    } else {
      return false;
    }

    // Get the right permissons, based on the type of the requester (client / server).
    const permissions = client.permissions[permissionsType] || [];

    // If /:user/ is in the url, we add some extra permissions.
    // If /me/ is used, we copy all user.*  to this_user.*
    // If a userid is used, we copy all users.* to this_user.*
    if (typeof params.user === 'string') {
      const permissionPrefix = params.user === 'me' ? 'user.' : 'users.';
      permissions.forEach(permission => {
        if (permission.startsWith(permissionPrefix)) {
          permissions.push(permission.replace(permissionPrefix, 'this_user.'));
        }
      });

      // Set the user variable to whoever is information is requested about, wether that is
      // 'me' or an user id.
      if (params.user === 'me') {
        if (!user) return false;
      } else {
        user = params.user;
      }
    }

    // Set the user id in the request object, so handlers can use it.
    request.user = user;

    // Return true if all permissions required are available.
    return permissionsRequired.every(r => permissions.includes(r));
  }
}

// tslint:disable-next-line:variable-name
export const RequirePermissions = (...permissions: string[]) => {
  // We add metadata to this method with the permissions required to use this method.
  // In the Guard above we use this metadata to verify if the client has access
  // to the requested method.
  const metadata = ReflectMetadata('permissionsRequired', permissions);

  const auth1 = ApiOAuth2Auth();
  const auth2 = ApiBearerAuth();

  return (target: object, key?: any, descriptor?: any) => {
    auth1(target, key, descriptor);
    auth2(target, key, descriptor);
    return metadata(target, key, descriptor);
  };
};

// tslint:disable-next-line:variable-name
export const User: () => ParameterDecorator = (...args: any[]) => {
  // This parameter decorator actually has two decorators in one.
  // First of all, it makes sure the request user is provided.
  const userDecoratorDataReturner = createParamDecorator((data, request) => {
    return request.user;
  })(...args);

  // Normally, that would be the only thing. But the API doesn't know
  // what the 'user' parameter does. So we need to let the Swagger API
  // know, and we can use ApiImplicitParam for that.
  const swaggerAdder = ApiImplicitParam({
    name: 'user',
    type: 'String',
    description: "An unique user id, or 'me' to use the authenticated user",
  });

  // Then it contructs the final parameter decorator.
  return (target, propertyKey, parameterIndex) => {
    // Just pass the arguments onto the request user provider.
    userDecoratorDataReturner(target, propertyKey, parameterIndex);

    // Normaly you add the ApiImplicitParam to the method instead of a parameter,
    // so we manually get the typed property descriptor of the method so the
    // metadata is added to the method correctly.
    swaggerAdder(target, propertyKey, Object.getOwnPropertyDescriptor(
      target,
      propertyKey,
    ) as TypedPropertyDescriptor<any>);
  };
};
