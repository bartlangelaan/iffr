import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FilmsProvider } from '../providers/films';

@Controller('films')
export class FilmsController {
  constructor(private readonly films: FilmsProvider) {}

  @Get('/list/:year')
  list(
    @Param('year', new ParseIntPipe())
    year: number,
    @Query('extended') extended: boolean,
  ) {
    return this.films.list(year, extended);
  }
}
