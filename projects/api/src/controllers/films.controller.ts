import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FilmsProvider } from '../providers/films';

@Controller('films')
export class FilmsController {
  constructor(private readonly films: FilmsProvider) {}

  @Get('/list/:year')
  async list(
    @Param('year', new ParseIntPipe())
    year: number,
    @Query('extended') extended: boolean,
    @Query('full') full: boolean,
  ) {
    if (!full) {
      return this.films.list(year, extended);
    }

    const list = await this.films.list(year);
    return Promise.all(list.map(f => this.films.get(f.id)));
  }
}
