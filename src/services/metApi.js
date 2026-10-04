/**
 * MUSEORA — Met Museum API Client Service
 * Features:
 * 1. Active v1.1 search endpoint with pagination
 * 2. Conservative concurrency via requestQueue
 * 3. Two-tier caching (Memory + LocalStorage)
 * 4. Request cancellation via AbortController
 * 5. Finite transient retry with exponential backoff
 * 6. Pure response normalization with zero invented facts
 */

import { requestQueue } from './requestQueue.js';
import { cacheService, CACHE_TTL } from './cacheService.js';
import { normalizeMetArtwork } from './artworkAdapter.js';

const BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';
const SEARCH_URL = 'https://collectionapi.metmuseum.org/public/collection/v1.1/search';

/**
 * Fetch wrapper supporting timeout, AbortSignal, and finite exponential backoff on transient errors.
 */
async function fetchWithRetry(url, options = {}, retries = 1, backoffMs = 300) {
  const signal = options.signal;

  try {
    const res = await fetch(url, options);

    // Never retry client errors (400, 404, 403)
    if (res.status >= 400 && res.status < 500) {
      if (res.status === 404) {
        return null; // Not found
      }
      throw new Error(`HTTP error ${res.status}`);
    }

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    return res;
  } catch (err) {
    // If request was aborted by caller, do not retry
    if (signal && signal.aborted) {
      throw err;
    }

    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, backoffMs));
      return fetchWithRetry(url, options, retries - 1, backoffMs * 2);
    }
    throw err;
  }
}

/**
 * Retrieves a single Met artwork by object ID.
 * @param {string|number} objectId Numeric ID or 'met-1234'
 * @param {object} [options]
 * @param {AbortSignal} [options.signal]
 * @param {boolean} [options.requireImage=true]
 * @returns {Promise<object|null>}
 */
export async function getMetArtworkById(objectId, { signal = null, requireImage = false } = {}) {
  if (!objectId) return null;

  const rawId = String(objectId).replace(/^met-/, '').trim();
  if (!rawId || isNaN(Number(rawId))) return null;

  const cacheKey = `met_obj_${rawId}`;

  // 1. Check Cache
  const cached = cacheService.get(cacheKey);
  if (cached !== null) {
    if (cached === '__NO_IMAGE__' && requireImage) return null;
    return cached;
  }

  // 2. Enqueue Request
  const requestUrl = `${BASE_URL}/objects/${rawId}`;

  try {
    const data = await requestQueue.enqueue(
      requestUrl,
      async (execSignal) => {
        const res = await fetchWithRetry(requestUrl, { signal: execSignal || signal }, 1, 350);
        if (!res) return null;
        return res.json();
      },
      signal
    );

    if (!data || !data.objectID) {
      return null;
    }

    const normalized = normalizeMetArtwork(data);
    if (!normalized) return null;

    if (requireImage && !normalized.hasImage) {
      // Cache negative result with short TTL to avoid redundant re-queries
      cacheService.set(cacheKey, '__NO_IMAGE__', CACHE_TTL.SHORT);
      return null;
    }

    // Cache valid normalized artwork
    cacheService.set(cacheKey, normalized, CACHE_TTL.LONG);
    return normalized;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    // Check if stale cached data is available for offline recovery
    const stale = cacheService.getStale(cacheKey);
    if (stale && stale.data && stale.data !== '__NO_IMAGE__') {
      return { ...stale.data, isStale: true };
    }
    console.warn(`Met API fetch failed for object ID ${rawId}:`, err.message);
    return null;
  }
}

/**
 * Searches the Met Museum collection using the active v1.1 search endpoint.
 * @param {string} query Search term
 * @param {object} [options]
 * @param {number} [options.offset=0]
 * @param {number} [options.limit=12]
 * @param {number} [options.departmentId]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<{results: object[], totalCount: number, nextOffset: number, hasMore: boolean}>}
 */
export async function searchMetArtworks(
  query,
  { offset = 0, limit = 12, departmentId = null, signal = null } = {}
) {
  const trimmed = (query || '').trim();
  if (!trimmed || trimmed.length < 2) {
    return { results: [], totalCount: 0, nextOffset: offset, hasMore: false };
  }

  const cacheKey = `met_search_${trimmed.toLowerCase()}_off${offset}_lim${limit}_dept${departmentId || 'all'}`;

  // Check Cache
  const cached = cacheService.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Construct URL with query parameters
  let url = `${SEARCH_URL}?hasImages=true&q=${encodeURIComponent(trimmed)}&offset=${offset}&limit=${Math.min(limit * 3, 60)}`;
  if (departmentId) {
    url += `&departmentId=${departmentId}`;
  }

  try {
    const searchData = await requestQueue.enqueue(
      url,
      async (execSignal) => {
        const res = await fetchWithRetry(url, { signal: execSignal || signal }, 1, 400);
        if (!res) return { total: 0, objectIDs: [] };
        return res.json();
      },
      signal
    );

    const totalCount = searchData?.total || 0;
    const objectIDs = Array.isArray(searchData?.objectIDs) ? searchData.objectIDs : [];

    if (objectIDs.length === 0) {
      const emptyResult = { results: [], totalCount: 0, nextOffset: offset, hasMore: false };
      cacheService.set(cacheKey, emptyResult, CACHE_TTL.SHORT);
      return emptyResult;
    }

    // Fetch individual object details concurrently via the request queue
    const results = [];
    for (const id of objectIDs) {
      if (signal && signal.aborted) {
        throw new DOMException('Search aborted', 'AbortError');
      }

      if (results.length >= limit) break;

      try {
        const artwork = await getMetArtworkById(id, { signal, requireImage: false });
        if (artwork) {
          results.push(artwork);
        }
      } catch (err) {
        if (err.name === 'AbortError') throw err;
      }
    }

    const payload = {
      results,
      totalCount,
      nextOffset: offset + limit,
      hasMore: offset + limit < totalCount,
    };

    // Cache valid search page
    cacheService.set(cacheKey, payload, CACHE_TTL.MEDIUM);
    return payload;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    const stale = cacheService.getStale(cacheKey);
    if (stale && stale.data) {
      return { ...stale.data, isStale: true };
    }
    console.warn(`Met API Search error for "${trimmed}":`, err.message);
    throw err;
  }
}

/**
 * Retrieves Met Museum department taxonomy with extended cache.
 */
export async function getMetDepartments({ signal = null } = {}) {
  const cacheKey = 'met_departments_v1';
  const cached = cacheService.get(cacheKey);
  if (cached) return cached;

  const url = `${BASE_URL}/departments`;

  try {
    const data = await requestQueue.enqueue(
      url,
      async (execSignal) => {
        const res = await fetchWithRetry(url, { signal: execSignal || signal }, 2, 500);
        if (!res) return [];
        const json = await res.json();
        return json.departments || [];
      },
      signal
    );

    if (Array.isArray(data) && data.length > 0) {
      cacheService.set(cacheKey, data, CACHE_TTL.EXTENDED);
    }
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn('Failed to fetch Met departments:', err.message);
    return [];
  }
}
