import { Module } from '@nestjs/common';
import { StatusController } from './controllers/status.controller';
import { OAuth2Controller } from './controllers/oauth2.controller';
import { UsersController } from './controllers/users.controller';
import { APP_GUARD } from '@nestjs/core';
import { ApplicationGuard } from './app.guard';
import { FilmsController } from './controllers/films.controller';
import { FavoritesProvider } from './providers/favorites';
import { FilmsProvider } from './providers/films';
import { StatusProvider } from './providers/status';
import { UserProvider } from './providers/user';
import { DrupalFavoritesService } from './services/drupal/favorites';
import { FionaPublicationApiService } from './services/fiona/publication-api';
import { TicketTriggerLoginService } from './services/tickettrigger/login';
import { TicketTriggerUserService } from './services/tickettrigger/user';

@Module({
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
    DrupalFavoritesService,
    FionaPublicationApiService,
    TicketTriggerLoginService,
    TicketTriggerUserService,
    FavoritesProvider,
    FilmsProvider,
    StatusProvider,
    UserProvider,
  ],
})
export default class AppModule {}
