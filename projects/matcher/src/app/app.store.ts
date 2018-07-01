import { observable, configure, action } from 'mobx';
import { stringify } from 'querystring';

configure({
  enforceActions: true,
  computedRequiresReaction: true,
});

export enum Screen {
  Guide1,
  Guide2,
  Guide3,
  Login,
  Matching,
  Planning,
  Profile,
}

export enum Language {
  NL = 'nl',
  EN = 'en',
}

export enum AuthState {
  Unauthorized,
  Pending,
  Authorized,
}

class AppStore {
  constructor() {
    // Get the access token we maybe previously saved.
    const accessToken = localStorage.getItem('accessToken');
    // If there is a ?code= in the url, we can use that to log in.
    const oauthCode = new URLSearchParams(document.location.search).get('code');
    // Remove url parameters from the url (without refreshing the page).
    history.replaceState({}, document.title, location.pathname);

    if (accessToken) {
      // If we already had an access token, we can directly log in using that.
      // We direct users directly to the matching screen.
      this.authorize(accessToken);
      this.screen = Screen.Matching;
    } else if (oauthCode) {
      // We need to get the access token before we can really log in.
      this.authState = AuthState.Pending;
      // We show the login screen in the meantime, here we'll show a loader.
      this.screen = Screen.Login;

      // We need to make a request to the API, so we can get an access token with
      // the code provided.
      const body = stringify({
        grant_type: 'authorization_code',
        code: oauthCode,
        client_id: 'matcher',
      });
      fetch('https://test.api.iffr.com/oauth2/token', {
        body,
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      })
        .then(r => r.json())
        .then(res => {
          // We authorize using the key we received.
          if (res.access_token) this.authorize(res.access_token);
          else {
            throw new Error(
              'No access token provided. Response: ' + JSON.stringify(res),
            );
          }
        })
        .catch(
          action(e => {
            // If something went wrong, we mark the user as 'Unauthorized' and
            // keep them on the login screen.
            console.error(e);
            this.authState = AuthState.Unauthorized;
          }),
        );
    }
  }

  fetch(path: string, body?: object) {
    const opts: RequestInit = {};
    const headers: { [h: string]: string } = {};

    if (this.accessToken) {
      headers.authorization = 'Bearer ' + this.accessToken;
    }

    if (body) {
      opts.method = 'POST';
      headers['content-type'] = 'application/x-www-form-urlencoded';
      opts.body = stringify(body);
    }

    opts.headers = headers;
    return fetch('https://test.api.iffr.com' + path, opts).then(a => {
      if (!a.ok) throw new Error(a.statusText);
      return a.json().catch(() => null);
    });
  }

  @action.bound
  authorize(accessToken: string) {
    this.authState = AuthState.Authorized;
    this.accessToken = accessToken;
    localStorage.setItem('accessToken', accessToken);
    this.screen = Screen.Matching;

    this.fetch('/users/me').then(
      action((user: UserResponse) => {
        this.user = user;
      }),
      this.unauthorize,
    );

    this.fetchFavorites();
    this.fetchSuggestion();
  }

  fetchFavorites = () => {
    this.fetch('/users/me/favorites').then(
      action((favorites: FavoritesResponse) => {
        this.favorites = favorites;
      }),
      this.unauthorize,
    );
  };

  fetchSuggestion = () => {
    this.fetch('/users/me/favorites/suggestion?year=2018').then(
      action((suggestion: SuggestionResponse) => {
        this.suggestion = suggestion;
      }),
      this.unauthorize,
    );
  };

  @action.bound
  unauthorize() {
    alert('Prevented unauthorizing!');
    return;
    this.authState = AuthState.Unauthorized;
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    this.screen = Screen.Guide1;
  }

  @observable screen: Screen = Screen.Guide1;
  @observable authState: AuthState = AuthState.Unauthorized;
  private accessToken: string | null = null;

  @action.bound
  setScreen(screen: Screen) {
    this.screen = screen;
  }

  @observable language: Language = Language.NL;

  @observable user: UserResponse | null = null;

  @observable favorites: FavoritesResponse | null = null;

  @observable suggestion: SuggestionResponse | null = null;

  like(id: string) {
    this.sendFavorite('like', id);
  }

  dislike(id: string) {
    this.sendFavorite('dislike', id);
  }

  @observable changingFavorite: string[] = [];

  @action.bound
  private sendFavorite(favAction: 'like' | 'dislike', id: string) {
    this.suggestion = null;
    this.fetch('/users/me/favorites', {
      id,
      action: favAction,
    }).then(
      action(() => {
        this.fetchFavorites();
        this.fetchSuggestion();
      }),
    );
  }
}

interface UserResponse {
  name: {
    first: string;
    full: string;
  };
  birthday: string | null;
}

interface Favorite {
  id: string;
  type: string;
}
interface FavoritesResponse {
  likes: Favorite[];
  dislikes: Favorite[];
}

interface SuggestionResponse {
  suggestions_left: number;
  suggestion: {
    id: string;
    title: string;
    lengthInMinutes: number;
    yearOfProduction: number;
    description: {
      catalogus?: {
        dutch: string;
        english: string;
      };
      'a-tot-z'?: {
        dutch: string;
        english: string;
      };
    };
    genre: string;
  };
}

const store = new AppStore();

export default store;
