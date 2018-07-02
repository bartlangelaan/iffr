import drupalFavorites, { Favorite } from '../services/drupal/favorites';
import { NotFoundException, Injectable } from '@nestjs/common';
import fiona from '../services/fiona/publication-api';

type FavoriteType = 'like' | 'dislike';

/**
 * Definition of a favorite: a like or a dislike. It can't be a like and a dislike at the same time.
 * If we add a favorite as 'like' but it was already a 'dislike', we change the status.
 * If a favorite is removed, it is neither a like or dislike. It's just gone.
 */
class FavoritesProvider {
  private getFionaIdFromFavorite = async (favorite: Favorite) => {
    const f = await drupalFavorites.getFionaIdFromDrupalId(favorite.nodeId);
    if (!f) {
      return null;
    }

    try {
      const film = await fiona.film(f.fiona);
      if (!film) {
        return null;
      }

      return { id: f.fiona, type: f.type, title: film.fullPreferredTitle };
    } catch (e) {
      return null;
    }
  };

  // Utility function: checks if an item is null.
  notNull<T>(value: T | null): value is T {
    return value !== null;
  }

  async get(user: string): Promise<FavoriteResponse> {
    const favorites = await drupalFavorites.list(user);

    const [likes, dislikes] = await Promise.all([
      Promise.all(
        favorites
          .filter(f => f.type !== 'dislike')
          .map(this.getFionaIdFromFavorite),
      ),

      Promise.all(
        favorites
          .filter(f => f.type === 'dislike')
          .map(this.getFionaIdFromFavorite),
      ),
    ]);

    return {
      likes: likes.filter(this.notNull),
      dislikes: dislikes.filter(this.notNull),
    };
  }

  async add(user: string, action: FavoriteType, film: string) {
    const drupalId = await drupalFavorites.getDrupalIdFromFionaId(film);
    if (!drupalId) {
      throw new NotFoundException('Item not found.');
    }

    const currentFavorites = await drupalFavorites.list(user);
    const existingFavorite = currentFavorites.find(
      f => f.nodeId === drupalId.id,
    );

    // In Drupal not 'like' but 'festivalevent' is used.
    // The 'dislike' category we made up ourselves, but the 'festivalevent' is used to
    // display the likes on the website.
    const drupalType = action === 'like' ? drupalId.type : 'dislike';

    // If the favorite already exists and is of the same type, we should do nothing.
    if (existingFavorite && existingFavorite.type === drupalType) {
      return;
    }

    // If the favorite already exists but is of a different type, we should remove the old favorite first.
    if (existingFavorite) {
      await drupalFavorites.delete(user, existingFavorite.id);
    }

    // Finally, add the favorite!
    await drupalFavorites.add(user, drupalId.id, drupalType);
  }

  async delete(user: string, film: string) {
    const drupalId = await drupalFavorites.getDrupalIdFromFionaId(film);
    if (!drupalId) {
      throw new NotFoundException('Item not found.');
    }
    const currentFavorites = await drupalFavorites.list(user);
    const existingFavorite = currentFavorites.find(
      f => f.nodeId === drupalId.id,
    );

    if (!existingFavorite) {
      throw new NotFoundException('Favorite not found.');
    }

    await drupalFavorites.delete(user, existingFavorite.id);
  }
}

export default new FavoritesProvider();

interface FavoriteResponse {
  likes: FavoriteResponseItem[];
  dislikes: FavoriteResponseItem[];
}

interface FavoriteResponseItem {
  id: string;
  type: string;
}
