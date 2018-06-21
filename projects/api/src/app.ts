import { Module } from '@nestjs/common';
import { StatusController } from './api/status.controller';
import { OAuth2Controller } from './api/oauth2';
import { UsersController } from './api/user';
import { APP_GUARD } from '@nestjs/core';
import { ApplicationGuard } from './auth';

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
