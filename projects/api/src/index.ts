import { NestFactory } from '@nestjs/core';
import App from './app';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(App);
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
