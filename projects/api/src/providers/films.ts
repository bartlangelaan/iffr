import { Injectable, NotFoundException } from '@nestjs/common';
import fiona from '../services/fiona/publication-api';
import {
  FilmId,
  FionaPublicationAPIFilmsListItem,
  FionaPublicationApiFilm,
  FionaPublicationAPIDescription,
  FionaPublicationAPITranslatableOption,
  ShowId,
} from '../services/fiona/__API_RESPONSES__/publication-api';
import * as sanitize from 'sanitize-html';

class FilmsProvider {
  private formatText(t: FionaPublicationAPIDescription) {
    return t.html.reduce<any>((des, item) => {
      des[item.language.key] = sanitize(item.html, {
        allowedTags: [],
      })
        .replace(/ |\n/g, ' ')
        .trim();
      return des;
    }, {});
  }

  private formatTexts(t: FionaPublicationAPIDescription[]) {
    return t.reduce<any>((all, des) => {
      all[des.type.key] = this.formatText(des);
      return all;
    }, {});
  }

  private formatTranslatable(
    translatable: FionaPublicationAPITranslatableOption,
  ) {
    return translatable.translations.reduce<any>(
      (res, t) => {
        res[t.language] = t.text;
        return res;
      },
      { key: translatable.key },
    );
  }

  async list(year: number, extended: boolean = false) {
    const edition = await fiona.edition(year);
    if (!edition) throw new NotFoundException('Year does not exist.');

    if (!extended) {
      const films = await fiona.films(edition.id);
      return films.map(f => ({ id: f.id, title: f.fullPreferredTitle }));
    }

    const films = await fiona.filmsAZ(edition.id);
    return films.map(f => ({
      id: f.id,
      title: f.fullPreferredTitle,
      lengthInMinutes: f.lengthInMinutes,
      yearOfProduction: f.yearOfProduction,
      description: this.formatText(f.texts[0]),
    }));
  }

  async get(filmid: FilmId) {
    const film = await fiona.film(filmid);

    const shows = await Promise.all(
      film.shows.map(s => this.getShow(s.id).catch(e => null)),
    );

    return {
      id: film.id,
      title: film.fullPreferredTitle,
      lengthInMinutes: film.lengthInMinutes,
      yearOfProduction: film.yearOfProduction,
      description: this.formatTexts(film.texts),
      category: this.formatTranslatable(film.category),
      compositions: film.compositions.map(c => c.type.key),
      genre: film.genre.key,
      sections: film.sections.map(s => this.formatTranslatable(s.section)),
      shows: shows.filter(s => s !== null),
      credits: film.credits.map(c => ({
        name: c.fullName,
        role: this.formatTranslatable(c.role),
      })),
      media: film.publications
        .filter(p => p.type.key === 'video')
        .map(p => ({ type: 'video', value: p.value })),
    };
  }

  async getShow(showId: ShowId) {
    const show = await fiona.show(showId);

    return {
      id: show.id,
      audience: show.audience.key,
      start: show.startOn,
      end: show.endOn,
      location: show.location,
      sroId: show.ticketSaleId,
      type: this.formatTranslatable(show.type),
    };
  }
}

export default new FilmsProvider();
