import { Module } from '@nestjs/common';
import { StatusController } from './controllers/status.controller';
import { OAuth2Controller } from './controllers/oauth2.controller';
import { UsersController } from './controllers/users.controller';
import { APP_GUARD } from '@nestjs/core';
import { ApplicationGuard } from './app.guard';

@Module({
  imports: [],
  controllers: [StatusController, OAuth2Controller, UsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApplicationGuard,
    },
  ],
})
export default class AppModule {}
