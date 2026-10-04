/**
 * MUSEORA — Two-Tier Cache Service
 * Tier 1: Fast In-Memory Map (current session)
 * Tier 2: Versioned LocalStorage with TTL and corruption recovery
 */

const SCHEMA_VERSION = 1;
const STORAGE_PREFIX = 'museora_cache_v1_';

// Default TTLs in milliseconds
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000,          // 5 minutes (rapid search results)
  MEDIUM: 60 * 60 * 1000,        // 1 hour
  LONG: 24 * 60 * 60 * 1000,     // 24 hours (artwork objects)
  EXTENDED: 7 * 24 * 60 * 60 * 1000, // 7 days (departments, static taxonomies)
};

class CacheService {
  constructor() {
    this.memoryCache = new Map();
  }

  _getStorageKey(key) {
    return `${STORAGE_PREFIX}${key}`;
  }

  /**
   * Retrieves an item from cache (Tier 1 memory first, then Tier 2 localStorage).
   * Returns null if missing or expired.
   */
  get(key) {
    const now = Date.now();

    // 1. Check Memory Cache
    if (this.memoryCache.has(key)) {
      const memItem = this.memoryCache.get(key);
      if (!memItem.exp || memItem.exp > now) {
        return memItem.data;
      }
      this.memoryCache.delete(key);
    }

    // 2. Check LocalStorage
    try {
      const storageKey = this._getStorageKey(key);
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;

      const record = JSON.parse(raw);

      // Validate schema and expiration
      if (!record || record.v !== SCHEMA_VERSION) {
        localStorage.removeItem(storageKey);
        return null;
      }

      if (record.exp && record.exp <= now) {
        // Return null for normal get, but retain in localStorage for getStale offline recovery
        return null;
      }

      // Populate memory cache for subsequent requests
      this.memoryCache.set(key, { data: record.data, exp: record.exp });
      return record.data;
    } catch {
      // Malformed JSON or storage disabled - purge safely
      try {
        localStorage.removeItem(this._getStorageKey(key));
      } catch {
        // Ignore storage access errors
      }
      return null;
    }
  }

  /**
   * Returns data even if expired, labeling it as stale. Useful for offline recovery.
   */
  getStale(key) {
    // Check memory first
    if (this.memoryCache.has(key)) {
      return { data: this.memoryCache.get(key).data, isStale: true };
    }

    try {
      const storageKey = this._getStorageKey(key);
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;

      const record = JSON.parse(raw);
      if (record && record.v === SCHEMA_VERSION && record.data) {
        return { data: record.data, isStale: true };
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Stores an item into memory and localStorage with a finite TTL.
   */
  set(key, data, ttlMs = CACHE_TTL.LONG) {
    if (data === undefined) return;

    const now = Date.now();
    const exp = ttlMs > 0 ? now + ttlMs : null;

    // Save to Tier 1 Memory
    this.memoryCache.set(key, { data, exp });

    // Save to Tier 2 LocalStorage
    try {
      const storageKey = this._getStorageKey(key);
      const record = {
        v: SCHEMA_VERSION,
        ts: now,
        exp,
        data,
      };
      localStorage.setItem(storageKey, JSON.stringify(record));
    } catch (e) {
      // Handle QuotaExceededError or security block
      this._handleQuotaExceeded(key, data, exp, e);
    }
  }

  /**
   * Removes an item from both cache tiers.
   */
  delete(key) {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(this._getStorageKey(key));
    } catch {
      // Ignore
    }
  }

  /**
   * Clears all cache entries managed by this version.
   */
  clear() {
    this.memoryCache.clear();
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignore
    }
  }

  /**
   * Evicts expired or oldest entries when storage quota is exceeded.
   */
  _handleQuotaExceeded(failedKey, data, exp, originalErr) {
    try {
      const now = Date.now();
      const entries = [];

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_PREFIX)) {
          try {
            const parsed = JSON.parse(localStorage.getItem(k));
            entries.push({ key: k, ts: parsed?.ts || 0, exp: parsed?.exp || 0 });
          } catch {
            entries.push({ key: k, ts: 0, exp: 0 });
          }
        }
      }

      // First purge expired items
      let purgedCount = 0;
      for (const item of entries) {
        if (item.exp && item.exp <= now) {
          localStorage.removeItem(item.key);
          purgedCount++;
        }
      }

      // If still cramped, purge oldest 40% of entries
      if (purgedCount < 3 && entries.length > 5) {
        entries.sort((a, b) => a.ts - b.ts);
        const toEvict = entries.slice(0, Math.ceil(entries.length * 0.4));
        toEvict.forEach((item) => localStorage.removeItem(item.key));
      }

      // Retry set
      const storageKey = this._getStorageKey(failedKey);
      localStorage.setItem(
        storageKey,
        JSON.stringify({ v: SCHEMA_VERSION, ts: now, exp, data })
      );
    } catch {
      // Fallback: silently retain in memory cache only without crashing the app
      console.warn('LocalStorage quota limit reached; caching in-memory only.', originalErr);
    }
  }
}

export const cacheService = new CacheService();
