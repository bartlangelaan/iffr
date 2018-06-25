import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
} from './__API_RESPONSES__/publication-api';
import { assure } from '../../utils/validate-schema';
import { getFionaPublicationApiKey } from '../../utils/environment';

@Injectable()
export class FionaPublicationApi {
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
    return this.fetch('/editiontypes', 'FionaPublicationApiEditionTypes');
  }
  private readonly festivalEditionType = 'f992810e-47d9-4f58-9515-f8aa7bd6e0ee';

  async editions(): Promise<FionaPublicationApiEditions> {
    return this.fetch(
      `/editiontypes/${this.festivalEditionType}/editions`,
      'FionaPublicationApiEditions',
    );
  }

  async edition(year: number) {
    const editions = await this.editions();
    return editions.find(e => e.year === year);
  }

  async films(edition: EditionId): Promise<FionaPublicationApiAPIFilmsList> {
    return await this.fetch(
      `/editions/${edition}/films`,
      'FionaPublicationApiAPIFilmsList',
    );
  }

  async filmsAZ(edition: EditionId): Promise<FionaPublicationApiAZFilmsList> {
    return await this.fetch(
      `/editions/${edition}/films/az`,
      'FionaPublicationApiAZFilmsList',
    );
  }

  async film(id: FilmId): Promise<FionaPublicationApiFilm> {
    return await this.fetch(`/films/${id}`, 'FionaPublicationApiFilm');
  }

  async show(id: ShowId): Promise<FionaPublicationApiShow> {
    return await this.fetch(`/shows/${id}`, 'FionaPublicationApiShow');
  }
}
