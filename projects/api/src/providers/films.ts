import { Injectable, NotFoundException } from '@nestjs/common';
import { FionaPublicationApi } from '../services/fiona/publication-api';
import { FilmId } from '../services/fiona/__API_RESPONSES__/publication-api';
import * as sanitize from 'sanitize-html';

@Injectable()
export class FilmsProvider {
  constructor(private readonly fiona: FionaPublicationApi) {}

  async list(year: number, extended: boolean = false) {
    const edition = await this.fiona.edition(year);
    if (!edition) throw new NotFoundException('Year does not exist.');

    if (!extended) {
      const films = await this.fiona.films(edition.id);
      return films.map(f => ({ id: f.id, title: f.fullPreferredTitle }));
    }

    const films = await this.fiona.filmsAZ(edition.id);
    return films.map(f => ({
      id: f.id,
      title: f.fullPreferredTitle,
      lengthInMinutes: f.lengthInMinutes,
      yearOfProduction: f.yearOfProduction,
      description: f.texts[0].html.reduce<any>((des, item) => {
        des[item.language.key] = sanitize(item.html, {
          allowedTags: [],
        })
          .replace(/ |\n/g, ' ')
          .trim();
        return des;
      }, {}),
    }));
  }

  async get(filmid: FilmId) {
    const film = await this.fiona.film(filmid);
  }
}
