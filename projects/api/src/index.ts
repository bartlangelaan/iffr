import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import App from './app';

declare const module: any;

async function bootstrap() {
  // Create the Nestjs application.
  const app = await NestFactory.create(App);

  // Create a documentation definition.
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('IFFR API')
      .setDescription('All API methods needed to get data from the IFFR')
      .setVersion(`build ${process.env.BUILD_ID} - ${process.env.BUILD_TIME}`)
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
    if (req.url === '/') res.redirect('/docs');
    else next();
  });

  // Bind to the specified port, or to port 3000 if unspcified.
  await app.listen(process.env.PORT || 3000);

  // Hot reloading, so developing is faster. Is ignored in production.
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
