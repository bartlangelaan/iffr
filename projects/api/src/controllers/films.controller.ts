import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FilmsProvider } from '../providers/films';
import { ApiUseTags } from '@nestjs/swagger';

@Controller('films')
@ApiUseTags('films')
export class FilmsController {
  constructor(private readonly films: FilmsProvider) {}

  @Get('/list/:year')
  async list(
    @Param('year', new ParseIntPipe())
    year: number,
  ) {
    return this.films.list(year);
  }

  @Get('/list/:year/extended')
  async listExtended(
    @Param('year', new ParseIntPipe())
    year: number,
  ) {
    return this.films.list(year, true);
  }

  @Get('/list/:year/full')
  async listFull(
    @Param('year', new ParseIntPipe())
    year: number,
  ) {
    const list = await this.films.list(year);
    return Promise.all(list.map(f => this.films.get(f.id)));
  }
}
