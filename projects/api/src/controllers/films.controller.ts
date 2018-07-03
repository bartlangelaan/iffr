import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FilmsProvider } from '../providers/films';
import { ApiUseTags } from '@nestjs/swagger';

@Controller('films')
@ApiUseTags('films')
export class FilmsController {
  constructor(private readonly filmsProvider: FilmsProvider) {}

  @Get('/list/:year')
  async list(
    @Param('year', new ParseIntPipe())
    year: number,
  ) {
    return this.filmsProvider.list(year);
  }

  @Get('/list/:year/extended')
  async listExtended(
    @Param('year', new ParseIntPipe())
    year: number,
  ) {
    return this.filmsProvider.list(year, true);
  }

  @Get('/list/:year/full')
  async listFull(
    @Param('year', new ParseIntPipe())
    year: number,
  ) {
    const list = await this.filmsProvider.list(year);
    return Promise.all(list.map(f => this.filmsProvider.get(f.id)));
  }
}
