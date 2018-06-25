import fetch from 'node-fetch';
import { stringify } from 'qs';
import {
  DrupalFavoritesList,
  DrupalFavoritesAdd,
  favoriteId,
  DrupalFavoritesFionaMapping,
} from './__API_RESPONSES__/favorites';
import { assure } from '../../utils/validate-schema';

type DrupalNodeId = string;

export interface Favorite {
  type: string;
  nodeId: DrupalNodeId;
  id: favoriteId;
}

class DrupalFavorites {
  async fetch(url: string, postBody?: object) {
    let opts = undefined;
    if (postBody) {
      opts = {
        method: 'POST',
        body: stringify(postBody),
        headers: {
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      };
    }
    const res = await fetch(`https://iffr.com/nl/iffr_favorites${url}`, opts);
    return res.json();
  }

  async list(userId: string): Promise<Favorite[]> {
    // Send the request to Drupal.
    const json: DrupalFavoritesList = await this.fetch(`/get_all/${userId}`);

    // The response is [] if the user has no likes. In that case we can just return [].
    if (typeof json[userId] !== 'object') {
      return [];
    }

    assure('DrupalFavoritesList', json);

    // Convert the response to an array of Favorite objects.
    const favoriteResponse = json[userId];
    return Object.entries(favoriteResponse).reduce<Favorite[]>(
      (list, [type, favoriteObject]) => {
        Object.entries(favoriteObject).forEach(([nodeId, id]) => {
          list.push({
            type,
            nodeId,
            id,
          });
        });
        return list;
      },
      [],
    );
  }

  async add(user: string, nodeId: string, type: string): Promise<favoriteId> {
    // Send the request to Drupal.
    const res: DrupalFavoritesAdd = await this.fetch(`/add`, {
      user_id: user,
      content_id: nodeId,
      content_type: type,
    });

    // Throw error if favorite couldn't be added.
    if (res.error) {
      throw new Error(
        `Couldn't add item ${nodeId} of type ${type} as favorite to user ${user}: ${
          res.error_message
        }`,
      );
    }

    // Return the new favorite id.
    return res.id;
  }

  async delete(user: string, favoriteId: favoriteId) {
    // Send the request to Drupal
    const res = await this.fetch(`/delete/${favoriteId}/${user}`);

    // Throw error if favorite couldn't be deleted.
    if (res.error) {
      throw new Error(
        `Could not delete favorite ${favoriteId} of user ${user}: ${
          res.error_message
        }`,
      );
    }
  }

  private mapping: Promise<DrupalFavoritesFionaMapping> | null = null;

  private async getMapping(
    types?: string[],
  ): Promise<DrupalFavoritesFionaMapping> {
    // Cheap cache.. save the promise in this.mapping if it was requested once.
    if (this.mapping) return this.mapping;

    // Request list in Drupal, and set the promise immideately. If the function is called
    // twice and the fetch isn't ready in between, both will use the same promise. This
    // way the endpoint won't be called twice at the same time.
    this.mapping = (async (): Promise<DrupalFavoritesFionaMapping> => {
      const res = await this.fetch('/fiona_ids');
      assure('DrupalFavoritesFionaMapping', res);
      return res;
    })();

    // Wait for the promise to resolve. If it failes, set this.mapping to null so new
    // requests will try to fetch again.
    try {
      return await this.mapping;
    } catch (e) {
      this.mapping = null;
      throw e;
    }
  }

  async getFionaIdFromDrupalId(drupalId: string, typings?: string[]) {
    const mapping = await this.getMapping();
    return mapping.find(i => i.id === drupalId);
  }

  async getDrupalIdFromFionaId(fionaId: string, typings?: string[]) {
    const mapping = await this.getMapping();
    return mapping.find(i => i.fiona === fionaId);
  }
}

export default new DrupalFavorites();
