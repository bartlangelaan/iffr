import { Module } from '@nestjs/common';
import { StatusController } from './controllers/status.controller';
import { OAuth2Controller } from './controllers/oauth2.controller';
import { UsersController } from './controllers/users.controller';
import { APP_GUARD } from '@nestjs/core';
import { ApplicationGuard } from './app.guard';
import { FilmsProvider } from './providers/films';
import { FionaPublicationApi } from './services/fiona/publication-api';
import { FilmsController } from './controllers/films.controller';
import { FavoritesProvider } from './providers/favorites';

@Module({
  imports: [],
  controllers: [
    StatusController,
    OAuth2Controller,
    UsersController,
    FilmsController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApplicationGuard,
    },
    FilmsProvider,
    FionaPublicationApi,
    FavoritesProvider,
  ],
})
export default class AppModule {}
