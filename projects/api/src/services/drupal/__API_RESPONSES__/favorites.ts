export type favoriteId = string;

export interface DrupalFavoritesList {
  [user: string]: {
    [favoriteType: string]: {
      [nodeId: string]: favoriteId;
    };
  };
}

interface DrupalField {
  und: [
    {
      value: string;
    }
  ];
}

export interface DrupalFavoritesAddSuccessful {
  error: undefined;
  type: 'favorites';
  field_content_type: DrupalField;
  field_user_id: DrupalField;
  field_ip_address: DrupalField;
  created: number;
  id: favoriteId;
}

export interface DrupalFavoritesAddError {
  error: true;
  error_message: string;
}

export type DrupalFavoritesAdd =
  | DrupalFavoritesAddSuccessful
  | DrupalFavoritesAddError;

export interface DrupalFavoritesFionaMappingItem {
  id: string;
  type: string;
  fiona: string;
}

export type DrupalFavoritesFionaMapping = DrupalFavoritesFionaMappingItem[];
