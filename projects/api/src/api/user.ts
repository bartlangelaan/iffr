import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import userProvider from '../providers/user';
import favorites from '../providers/favorites';
import ttUser from '../services/tickettrigger/user';
import { RequirePermissions, User } from '../auth';

@Controller('users')
export class UsersController {
  @Get()
  @RequirePermissions('users.view')
  list(@Query('query') query: string) {
    return ttUser.query(query);
  }

  @Get('/:user')
  @RequirePermissions('this_user.view')
  overview(@User() user: string) {
    return userProvider.getUser(user);
  }

  @Get('/:user/favorites')
  @RequirePermissions('this_user.favorites.view')
  favorites(@User() user: string) {
    return favorites.get(user);
  }

  @Post('/:user/favorites')
  @RequirePermissions('this_user.favorites.edit')
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
  deleteFavorite(@User() user: string, @Body('id') id: string) {
    return favorites.delete(user, id);
  }
}
