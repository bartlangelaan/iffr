import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import App from './app';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(App);

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('IFFR API')
      .setDescription('All API methods needed to get data from the IFFR')
      .setVersion('1.0')
      .addBearerAuth('client_secret', 'query')
      .addOAuth2('accessCode', '/oauth2/auth', '/oauth2/token')
      .build(),
  );

  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT || 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
