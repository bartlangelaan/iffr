import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import fetch from 'node-fetch';
import { Agent } from 'https';
import {
  FilmId,
  ShowId,
  EditionId,
  FionaPublicationApiEditions,
  FionaPublicationApiEditionTypes,
  FionaPublicationApiAPIFilmsList,
  FionaPublicationApiAZFilmsList,
  FionaPublicationApiFilm,
  FionaPublicationApiShow,
  FionaPublicationApiShowResponse,
} from './__API_RESPONSES__/publication-api';
import { assure } from '../../utils/validate-schema';
import { getFionaPublicationApiKey } from '../../utils/environment';

@Injectable()
export class FionaPublicationApi {
  private cache: FionaCache = {
    editionTypes: undefined,
    editions: undefined,
    filmsList: {},
    filmsListAZ: {},
    films: {},
    shows: {},
  };

  private async fetch(method: string, schema?: string) {
    const apikey = getFionaPublicationApiKey();
    if (!apikey) {
      throw new InternalServerErrorException(
        "Coundn't connect to the Fiona Publication API because the API key is missing.",
      );
    }
    const res = await fetch('https://iffr-a-api.fiona-online.net/v1' + method, {
      headers: {
        apikey,
      },
      agent: new Agent({ rejectUnauthorized: false }),
    });
    const json = await res.json();
    if (schema) {
      assure(schema, json);
    }
    return json;
  }

  async editionTypes(): Promise<FionaPublicationApiEditionTypes> {
    if (this.cache.editionTypes) return this.cache.editionTypes;

    this.cache.editionTypes = this.fetch(
      '/editiontypes',
      'FionaPublicationApiEditionTypes',
    );

    try {
      return await this.cache.editionTypes;
    } catch (e) {
      delete this.cache.editionTypes;
      throw e;
    }
  }
  private readonly festivalEditionType = 'f992810e-47d9-4f58-9515-f8aa7bd6e0ee';

  async editions(): Promise<FionaPublicationApiEditions> {
    if (this.cache.editions) return this.cache.editions;

    this.cache.editions = this.fetch(
      `/editiontypes/${this.festivalEditionType}/editions`,
      'FionaPublicationApiEditions',
    );

    try {
      return await this.cache.editions;
    } catch (e) {
      delete this.cache.editions;
      throw e;
    }
  }

  async edition(year: number) {
    const editions = await this.editions();
    return editions.find(e => e.year === year);
  }

  async films(edition: EditionId): Promise<FionaPublicationApiAPIFilmsList> {
    if (this.cache.filmsList[edition]) return this.cache.filmsList[edition];

    this.cache.filmsList[edition] = this.fetch(
      `/editions/${edition}/films`,
      'FionaPublicationApiAPIFilmsList',
    );

    try {
      return await this.cache.filmsList[edition];
    } catch (e) {
      delete this.cache.filmsList[edition];
      throw e;
    }
  }

  async filmsAZ(edition: EditionId): Promise<FionaPublicationApiAZFilmsList> {
    if (this.cache.filmsListAZ[edition]) return this.cache.filmsListAZ[edition];

    this.cache.filmsListAZ[edition] = this.fetch(
      `/editions/${edition}/films/az`,
      'FionaPublicationApiAZFilmsList',
    );

    try {
      return await this.cache.filmsListAZ[edition];
    } catch (e) {
      delete this.cache.filmsListAZ[edition];
      throw e;
    }
  }

  async film(id: FilmId): Promise<FionaPublicationApiFilm> {
    if (this.cache.films[id]) return this.cache.films[id];

    this.cache.films[id] = this.fetch(
      `/films/${id}`,
      'FionaPublicationApiFilm',
    );

    try {
      const film = await this.cache.films[id];
      return film;
    } catch (e) {
      delete this.cache.films[id];
      throw e;
    }
  }

  async show(id: ShowId): Promise<FionaPublicationApiShow> {
    if (this.cache.shows[id]) return this.cache.shows[id];

    this.cache.shows[id] = (async (): Promise<FionaPublicationApiShow> => {
      let show: FionaPublicationApiShowResponse;
      try {
        show = await this.fetch(
          `/shows/${id}`,
          'FionaPublicationApiShowResponse',
        );
      } catch (e) {
        console.error(e);
        delete this.cache.shows[id];
        throw e;
      }
      if (show === null) {
        throw new NotFoundException(`Show ${id} does not exist in Fiona.`);
      }
      return show;
    })();

    const show = await this.cache.shows[id];

    return show;
  }
}

interface FionaCache {
  editionTypes: undefined | Promise<FionaPublicationApiEditionTypes>;
  editions: undefined | Promise<FionaPublicationApiEditions>;
  filmsList: {
    [edition: string]: Promise<FionaPublicationApiAPIFilmsList>;
  };
  filmsListAZ: {
    [edition: string]: Promise<FionaPublicationApiAZFilmsList>;
  };
  films: {
    [id: string]: Promise<FionaPublicationApiFilm>;
  };
  shows: {
    [id: string]: Promise<FionaPublicationApiShow>;
  };
}
