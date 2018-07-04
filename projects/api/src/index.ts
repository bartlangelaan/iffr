import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import App from './app';
import ravenClient from './utils/ravenClient';

declare const module: any;

async function bootstrap() {
  // Create the Nestjs application.
  const app = await NestFactory.create(App);

  app.enableCors();

  app.set('trust proxy', true);

  // Create a documentation definition.
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('IFFR API')
      .setDescription(
        "With these JSON endpoints it's possible to get various data from the International Film Festival Rotterdam.",
      )
      .setVersion(`last release: ${process.env.BUILD_TIME}`)
      .setSchemes('https')
      .setHost('test.api.iffr.com')
      .addBearerAuth('client_secret', 'query')
      .addOAuth2('accessCode', '/oauth2/auth', '/oauth2/token')
      .build(),
  );

  // Mount the documentation on /docs.
  SwaggerModule.setup('/docs', app, document);

  // Redirect / to /docs
  app.use((req: any, res: any, next: any) => {
    if (req.hostname === 'iffr-api.herokuapp.com') {
      res.redirect('https://test.api.iffr.com' + req.url);
    } else if (!req.secure && req.hostname === 'test.api.iffr.com') {
      res.redirect('https://' + req.hostname + req.url);
    } else if (req.url === '/') {
      res.redirect('/docs');
    } else next();
  });

  // Bind to the specified port, or to port 3000 if unspcified.
  await app.listen(process.env.PORT || 3000);

  // Hot reloading, so developing is faster. Is ignored in production.
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

// We install the Raven client, which means it captures http requests, console logs, etc.
// The client is created in ./utils/ravenClient.ts because it is also used in the
// app.interceptor.ts file to log all 500 errors.
ravenClient.install();

// We use 'context' to execute the bootstrap function, because Raven wants us to bootstrap
// everything. That should result in better error reporting.
ravenClient.context(bootstrap);
