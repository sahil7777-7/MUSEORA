/**
 * MUSEORA — Local Storage Utility
 * Versioned, quota-safe storage helper for visitor favorites, viewed history, and tour passport.
 */

const STORAGE_VERSION = 'v1';
const PREFIX = `museora_${STORAGE_VERSION}_`;

const KEYS = {
  FAVORITES: `${PREFIX}favorites`,
  VIEWED: `${PREFIX}viewed_artworks`,
  TOURS: `${PREFIX}completed_tours`,
};

// Legacy keys for automatic migration
const LEGACY_KEYS = {
  FAVORITES: 'museora_favorites',
  VIEWED: 'museora_viewed_artworks',
  TOURS: 'museora_completed_tours',
};

/**
 * Safely reads and parses a JSON array from localStorage with legacy migration fallback.
 */
function readArray(versionedKey, legacyKey) {
  try {
    let raw = localStorage.getItem(versionedKey);
    if (!raw && legacyKey) {
      raw = localStorage.getItem(legacyKey);
      if (raw) {
        // Migrate to versioned key
        try {
          localStorage.setItem(versionedKey, raw);
        } catch {
          // Ignore
        }
      }
    }
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Safely writes JSON string to localStorage with quota safety.
 */
function writeItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`LocalStorage write error for ${key}:`, err);
  }
}

export const getFavorites = () => {
  return readArray(KEYS.FAVORITES, LEGACY_KEYS.FAVORITES);
};

export const isFavorite = (artworkId) => {
  if (!artworkId) return false;
  const favs = getFavorites();
  return favs.includes(String(artworkId));
};

export const toggleFavorite = (artworkId) => {
  if (!artworkId) return getFavorites();
  const idStr = String(artworkId);
  const favs = getFavorites();
  let updated;

  if (favs.includes(idStr)) {
    updated = favs.filter((id) => id !== idStr);
  } else {
    updated = [...favs, idStr];
  }

  writeItem(KEYS.FAVORITES, updated);
  return updated;
};

export const getViewedArtworks = () => {
  return readArray(KEYS.VIEWED, LEGACY_KEYS.VIEWED);
};

export const addViewedArtwork = (artworkId) => {
  if (!artworkId) return;
  const idStr = String(artworkId);
  const viewed = getViewedArtworks();
  if (!viewed.includes(idStr)) {
    // Keep last 100 viewed items to avoid unbounded storage growth
    const updated = [idStr, ...viewed].slice(0, 100);
    writeItem(KEYS.VIEWED, updated);
  }
};

export const getCompletedToursCount = () => {
  try {
    const raw = localStorage.getItem(KEYS.TOURS) || localStorage.getItem(LEGACY_KEYS.TOURS);
    if (!raw) return 1;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? 1 : parsed;
  } catch {
    return 1;
  }
};

export const incrementCompletedTours = () => {
  const current = getCompletedToursCount();
  try {
    localStorage.setItem(KEYS.TOURS, String(current + 1));
  } catch (err) {
    console.warn('LocalStorage error updating tours:', err);
  }
};
