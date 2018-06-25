export type EditionTypeId = string;
export type EditionId = string;
export type FilmId = string;
export type ShowId = string;

export interface FionaPublicationApiEditionType {
  id: EditionTypeId;
  activeEdition: {
    id: EditionId;
    description: string;
  };
  description: string;
  name: string;
}

export type FionaPublicationApiEditionTypes = FionaPublicationApiEditionType[];

export interface FionaPublicationApiEdition {
  id: EditionId;
  editionType: {
    id: EditionTypeId;
    description: string;
  };
  endFestivalEvent: string;
  name: string;
  startFestivalEvent: string;
  year: number;
}

export type FionaPublicationApiEditions = FionaPublicationApiEdition[];

/**
 * /editions/{edition}/films
 */
export interface FionaPublicationAPIFilmsListItem {
  id: FilmId;
  fullPreferredTitle: string;
  sortedTitle: string;
}

export type FionaPublicationApiAPIFilmsList = FionaPublicationAPIFilmsListItem[];

/**
 * /editions/{edition}/films/az
 */
export interface FionaPublicationApiAZFilmsListItem {
  id: string;
  directors: FionaPublicationApiIdName[];
  fullOriginalTitle: string;
  fullPreferredTitle: string;
  image: {
    height: number;
    value: string;
    width: number;
  } | null;
  lengthInMinutes: number;
  sortedTitle: string;
  texts: [
    {
      id: string;
      html: FionaPublicationAPITextsHTML[];
    }
  ];
  useOriginalTitle: boolean;
  video: null | {
    title: string;
    value: string;
  };
  yearOfProduction: number;
}

interface FionaPublicationAPITextsHTML {
  html: string;
  language: FionaPublicationAPITranslatableOption;
}

interface FionaPublicationApiIdName {
  id: string;
  name: string;
}

export type FionaPublicationApiAZFilmsList = FionaPublicationApiAZFilmsListItem[];

interface FionaPublicationAPITranslatableOption {
  key: string;
  translations: [
    {
      abbreviation: string;
      language: 'nl' | 'en';
      text: string;
    }
  ];
}

export interface FionaPublicationApiFilm {
  id: FilmId;
  category: FionaPublicationAPITranslatableOption;
  colour: FionaPublicationAPITranslatableOption;
  completed: boolean;
  compositions: [
    {
      id: string;
      fullTitle: string;
      section: {
        id: string;
        description: string;
      };
      type: FionaPublicationAPITranslatableOption;
    }
  ];
  fullOriginalTitle: string;
  fullPreferredTitle: string;
  genre: FionaPublicationAPITranslatableOption;
  lengthInMinutes: number;
  originalTitle: string;
  premiere: FionaPublicationAPITranslatableOption;
  sections: [
    {
      id: string;
      name: string;
      section: FionaPublicationAPITranslatableOption;
    }
  ];
  shows: [
    {
      id: ShowId;
      description: string;
    }
  ];
  sortedTitle: string;
  spokenLanguages: [FionaPublicationAPITranslatableOption];
  useOriginalTitle: boolean;
  yearOfProduction: number;
}

export interface FionaPublicationApiShow {
  id: ShowId;
  audience: FionaPublicationAPITranslatableOption;
  endOn: string;
  fullTitle: string;
  hasAudienceVoting: boolean;
  isOfficialSelection: boolean;
  isPremiere: boolean;
  lengthInMinuties: number;
  location: {
    id: string;
    abbreviation: string;
    description: string;
  };
  noSale: boolean;
  publish: boolean;
  schedule: {
    id: string;
    description: string;
  };
  section: {
    id: string;
    description: string;
  };
  showParts: [
    {
      id: string;
      film: {
        id: FilmId;
        description: string;
      } | null;
      lengthInMinutes: number;
      subtitleLanguages: any[];
      title: string;
    }
  ];
  sortedTitle: string;
  sourceComposition: {
    id: string;
    description: string;
  };
  startOn: string;
  ticketSaleId: string;
  type: FionaPublicationAPITranslatableOption;
  edition: {
    id: EditionId;
    description: string;
  };
}
