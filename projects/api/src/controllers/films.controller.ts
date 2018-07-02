import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import filmsProvider from '../providers/films';
import { ApiUseTags } from '@nestjs/swagger';

@Controller('films')
@ApiUseTags('films')
export class FilmsController {
  @Get('/list/:year')
  async list(
    @Param('year', new ParseIntPipe())
    year: number,
  ) {
    return filmsProvider.list(year);
  }

  @Get('/list/:year/extended')
  async listExtended(
    @Param('year', new ParseIntPipe())
    year: number,
  ) {
    return filmsProvider.list(year, true);
  }

  @Get('/list/:year/full')
  async listFull(
    @Param('year', new ParseIntPipe())
    year: number,
  ) {
    const list = await filmsProvider.list(year);
    return Promise.all(list.map(f => filmsProvider.get(f.id)));
  }
}
