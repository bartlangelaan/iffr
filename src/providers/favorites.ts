import drupalFavorites from '../services/drupal/favorites';
import { INSPECT_MAX_BYTES } from 'buffer';

type FavoriteType = 'like' | 'dislike';

/**
 * Definition of a favorite: a like or a dislike. It can't be a like and a dislike at the same time.
 * If we add a favorite as 'like' but it was already a 'dislike', we change the status.
 * If a favorite is removed, it is neither a like or dislike. It's just gone.
 *
 * At this moment, you can add everything as a like. It's not checked. But please, only add favorites
 * for movies.
 *
 * TODO: Instead of passing Drupal IDs, we should pass Fiona IDs. We need a Drupal endpoint for this.
 */
class FavoritesProvider {
  async get(user: string) {
    const favorites = await drupalFavorites.list(user);

    return {
      likes: favorites.filter(f => f.type !== 'dislike').map(f => f.nodeId),
      dislikes: favorites.filter(f => f.type === 'dislike').map(f => f.nodeId),
    };
  }

  async add(user: string, action: FavoriteType, film: string) {
    const currentFavorites = await drupalFavorites.list(user);
    const existingFavorite = currentFavorites.find(f => f.nodeId === film);

    // In Drupal not 'like' but 'festivalevent' is used.
    // The 'dislike' category we made up ourselves, but the 'festivalevent' is used to
    // display the likes on the website.
    const drupalType = action === 'like' ? 'festivalevent' : 'dislike';

    // If the favorite already exists and is of the same type, we should do nothing.
    if (existingFavorite && existingFavorite.type === drupalType) {
      return;
    }

    // If the favorite already exists but is of a different type, we should remove the old favorite first.
    if (existingFavorite) {
      await drupalFavorites.delete(user, existingFavorite.id);
    }

    // Finally, add the favorite!
    await drupalFavorites.add(user, film, drupalType);
  }

  async delete(user: string, film: string) {
    const currentFavorites = await drupalFavorites.list(user);
    const existingFavorite = currentFavorites.find(f => f.nodeId === film);

    if (!existingFavorite) {
      throw new Error('Favorite not found.');
    }

    await drupalFavorites.delete(user, existingFavorite.id);
  }
}

export default new FavoritesProvider();
