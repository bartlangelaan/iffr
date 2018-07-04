/**
 * This file intercepts all (non 4xx) errors that the application returns, and logs them to Sentry. Then it throws
 * a new error (InternalServerErrorException) that contains the Sentry error id in the message, so the requester
 * receives a code. This code is linked to this unique error in Sentry, so that exact error can be looked up in
 * Sentry if someone gives you that error code.
 *
 * It uses the 'raven' module to log things to Sentry. The Raven client is created in another file
 * (./utils/ravenClient) so the same client can also be used in other files.
 *
 * This file is mostly boilerplate from https://docs.nestjs.com/interceptors. This was also used as inspiration:
 * https://github.com/mentos1386/nest-raven/blob/master/lib/raven.interceptor.abstract.ts
 */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import ravenClient from './utils/ravenClient';
import { tap } from 'rxjs/operators';

@Injectable()
export class IFFRInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Promise<Observable<any>> {
    // Get some of the request parameters, so we can use them if something goes wrong.
    const req = context.switchToHttp().getRequest();
    const user = req ? { id: req.user } : null;
    const ctxt = { req, user };

    // We wrap everythinng in a context function, because Raven wants us to do that.
    // It should generate better stacktraces and logging.
    return ravenClient.context(ctxt, () => {
      return call$.pipe(
        tap(undefined, error => {
          // This is only executed if something went wrong. We want the error to be logged,
          // if there is no error.status or if the error.status is not a 4xx error.
          if (!error.status || !(error.status >= 400 && error.status < 500)) {
            // This sends the error to Sentry, with the previously created context.
            // This function returns an unique error id, that can be used in Sentry to look
            // this error up.
            const code = ravenClient.captureException(error, ctxt);

            // Still, log the error to the console. Also log the unique error id while we're at it.
            console.error(error);
            console.error(`Logged error to Sentry: ${code}`);

            // Throw a new InteralServerErrorException, that is actually shown to the user. This way
            // users of the application can use this error id to send error reports.
            throw new InternalServerErrorException(
              `Some unknown error occured. Unique error ID: ${code}`,
            );
          }
        }),
      );
    });
  }
}
