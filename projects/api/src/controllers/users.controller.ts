import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserProvider } from '../providers/user';
import { TicketTriggerUserService } from '../services/tickettrigger/user';
import { RequirePermissions, User } from '../app.guard';
import { ApiImplicitParam, ApiUseTags } from '@nestjs/swagger';
import { FilmsProvider } from '../providers/films';
import { FavoritesProvider } from '../providers/favorites';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userProvider: UserProvider,
    private readonly ttUserService: TicketTriggerUserService,
    private readonly filmsProvider: FilmsProvider,
    private readonly favoritesProvider: FavoritesProvider,
  ) {}

  @Get()
  @RequirePermissions('users.view')
  @ApiUseTags('users')
  list(@Query('query') query: string) {
    return this.ttUserService.query(query);
  }

  @Get('/:user')
  @RequirePermissions('this_user.view')
  @ApiImplicitParam({ name: 'user', type: 'String' })
  @ApiUseTags('users')
  overview(@User() user: string) {
    return this.userProvider.getUser(user);
  }

  @Get('/:user/favorites')
  @RequirePermissions('this_user.favorites.view')
  @ApiUseTags('favorites')
  favorites(@User() user: string) {
    return this.favoritesProvider.get(user);
  }

  @Post('/:user/favorites')
  @RequirePermissions('this_user.favorites.edit')
  @ApiUseTags('favorites')
  addFavorite(
    @User() user: string,
    @Body('id') id: string,
    @Body('action') action: string,
  ) {
    if (action !== 'like' && action !== 'dislike') {
      throw new BadRequestException();
    }
    return this.favoritesProvider.add(user, action, id);
  }

  @Delete('/:user/favorites')
  @RequirePermissions('this_user.favorites.edit')
  @ApiUseTags('favorites')
  deleteFavorite(@User() user: string, @Body('id') id: string) {
    return this.favoritesProvider.delete(user, id);
  }

  @Get('/:user/favorites/suggestion')
  @RequirePermissions('this_user.favorites.view')
  @ApiUseTags('favorites')
  async favoriteSuggestion(
    @User() user: string,
    @Query('year', new ParseIntPipe())
    year: number,
  ) {
    // Get a list of all films and all favorites.
    const [films, favs] = await Promise.all([
      this.filmsProvider.list(year),
      this.favoritesProvider.get(user),
    ]);

    // Combine the likes and dislikes.
    const favsFlat = [...favs.likes, ...favs.dislikes];

    // Only films that aren't in the favorites already.
    const filmsNotFavorited = films.filter(
      film => !favsFlat.some(favorite => favorite.id === film.id),
    );

    // We need the full film objects, so we can filter on type.
    const fullFilmsNotFavorited = await Promise.all(
      filmsNotFavorited.map(film => this.filmsProvider.get(film.id)),
    );

    // Only the feature films with at least one show and a trailer.
    const features = fullFilmsNotFavorited.filter(
      film =>
        film.category.key === 'speelfilm' &&
        film.shows.length &&
        film.media.length,
    );

    return {
      suggestions_left: features.length,
      // Return a random feature!
      suggestion: features[Math.floor(Math.random() * features.length)],
    };
  }
}
