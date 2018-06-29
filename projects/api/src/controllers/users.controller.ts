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
import userProvider from '../providers/user';
import favorites from '../providers/favorites';
import ttUser from '../services/tickettrigger/user';
import { RequirePermissions, User } from '../app.guard';
import { ApiImplicitParam, ApiUseTags } from '@nestjs/swagger';
import { FilmsProvider } from '../providers/films';

@Controller('users')
export class UsersController {
  constructor(private readonly films: FilmsProvider) {}

  @Get()
  @RequirePermissions('users.view')
  @ApiUseTags('users')
  list(@Query('query') query: string) {
    return ttUser.query(query);
  }

  @Get('/:user')
  @RequirePermissions('this_user.view')
  @ApiImplicitParam({ name: 'user', type: 'String' })
  @ApiUseTags('users')
  overview(@User() user: string) {
    return userProvider.getUser(user);
  }

  @Get('/:user/favorites')
  @RequirePermissions('this_user.favorites.view')
  @ApiUseTags('favorites')
  favorites(@User() user: string) {
    return favorites.get(user);
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
    return favorites.add(user, action, id);
  }

  @Delete('/:user/favorites')
  @RequirePermissions('this_user.favorites.edit')
  @ApiUseTags('favorites')
  deleteFavorite(@User() user: string, @Body('id') id: string) {
    return favorites.delete(user, id);
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
      this.films.list(year),
      favorites.get(user),
    ]);

    // Combine the likes and dislikes.
    const favsFlat = [...favs.likes, ...favs.dislikes];

    // Only films that aren't in the favorites already.
    const filmsNotFavorited = films.filter(
      film => !favsFlat.some(favorite => favorite.id === film.id),
    );

    // We need the full film objects, so we can filter on type.
    const fullFilmsNotFavorited = await Promise.all(
      filmsNotFavorited.map(film => this.films.get(film.id)),
    );

    // Only the feature films with at least one show.
    const features = fullFilmsNotFavorited.filter(
      film => film.category.key === 'speelfilm' && film.shows.length,
    );

    return {
      suggestions_left: features.length,
      // Return a random feature!
      suggestion: features[Math.floor(Math.random() * features.length)],
    };
  }
}
