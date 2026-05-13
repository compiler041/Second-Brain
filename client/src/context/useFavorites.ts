import { useState, useCallback } from 'react';

export type FavoriteType = 'task' | 'note' | 'tweet' | 'video';

interface FavoriteItem {
  type: FavoriteType;
  id: number;
}

const STORAGE_KEY = 'sb_favorites';

function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(items: FavoriteItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites);

  const isFavorite = useCallback(
    (type: FavoriteType, id: number) => {
      return favorites.some((f) => f.type === type && f.id === id);
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    (type: FavoriteType, id: number) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.type === type && f.id === id);
        const next = exists
          ? prev.filter((f) => !(f.type === type && f.id === id))
          : [...prev, { type, id }];
        saveFavorites(next);
        return next;
      });
    },
    []
  );

  const getFavoriteIds = useCallback(
    (type: FavoriteType) => {
      return favorites.filter((f) => f.type === type).map((f) => f.id);
    },
    [favorites]
  );

  return { favorites, isFavorite, toggleFavorite, getFavoriteIds };
}
