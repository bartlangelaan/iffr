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
  texts: [FionaPublicationAPIDescription];
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

export interface FionaPublicationAPITranslatableOption {
  key: string;
  translations: [
    {
      abbreviation: string | null;
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
  compositions: {
    id: string;
    fullTitle: string;
    section: null | {
      id: string;
      description: string;
    };
    type: FionaPublicationAPITranslatableOption;
  }[];
  credits: {
    id: string;
    fullName: string;
    person: {
      id: string;
      description: string;
    };
    role: FionaPublicationAPITranslatableOption;
  }[];
  fullOriginalTitle: string;
  fullPreferredTitle: string;
  genre: FionaPublicationAPITranslatableOption;
  lengthInMinutes: number;
  originalTitle: string;
  premiere: FionaPublicationAPITranslatableOption;
  publications: {
    id: string;
    title: string;
    type: FionaPublicationAPITranslatableOption;
    value: string;
  }[];
  sections: {
    id: string;
    name: string;
    section: FionaPublicationAPITranslatableOption;
  }[];
  shows: {
    id: ShowId;
    description: string;
  }[];
  sortedTitle: string;
  spokenLanguages: FionaPublicationAPITranslatableOption[];
  texts: FionaPublicationAPIDescription[];
  useOriginalTitle: boolean;
  yearOfProduction: number;
}

export interface FionaPublicationAPIDescription {
  id: string;
  html: FionaPublicationAPITextsHTML[];
  type: FionaPublicationAPITranslatableOption;
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
    abbreviation: null | string;
    description: string;
  };
  noSale: boolean;
  publish: boolean;
  schedule: {
    id: string;
    description: string;
  };
  section: null | {
    id: string;
    description: string;
  };
  showParts: {
    id: string;
    film: {
      id: FilmId;
      description: string;
    } | null;
    lengthInMinutes: number;
    subtitleLanguages: any[];
    title: string;
  }[];
  sortedTitle: string;
  sourceComposition: null | {
    id: string;
    description: string;
  };
  startOn: string;
  ticketSaleId: null | string;
  type: FionaPublicationAPITranslatableOption;
  edition: {
    id: EditionId;
    description: string;
  };
}

export type FionaPublicationApiShowResponse = null | FionaPublicationApiShow;
