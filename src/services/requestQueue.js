/**
 * MUSEORA — Global Request Queue & In-Flight Request Deduplicator
 * Enforces conservative concurrency (default max 4) and prevents duplicate network requests.
 */

class RequestQueue {
  constructor(concurrency = 4) {
    this.concurrency = concurrency;
    this.runningCount = 0;
    this.queue = [];
    this.inFlightMap = new Map(); // key -> Promise
  }

  /**
   * Enqueues or deduplicates an async task.
   * @param {string} key Unique request key (e.g. endpoint URL or cache key)
   * @param {Function} taskFn Function returning a Promise `(signal) => Promise<any>`
   * @param {AbortSignal} [signal] Optional AbortSignal
   * @returns {Promise<any>}
   */
  enqueue(key, taskFn, signal = null) {
    // 1. Check if request was already aborted
    if (signal && signal.aborted) {
      return Promise.reject(new DOMException('Request aborted', 'AbortError'));
    }

    // 2. In-flight deduplication: reuse active promise if same request is already pending
    if (key && this.inFlightMap.has(key)) {
      return this.inFlightMap.get(key);
    }

    // 3. Create managed promise
    let queueEntry;
    const promise = new Promise((resolve, reject) => {
      queueEntry = {
        key,
        taskFn,
        signal,
        resolve,
        reject,
      };

      // Handle abort while waiting in queue
      if (signal) {
        const onAbort = () => {
          signal.removeEventListener('abort', onAbort);
          const idx = this.queue.indexOf(queueEntry);
          if (idx !== -1) {
            this.queue.splice(idx, 1);
          }
          if (key) this.inFlightMap.delete(key);
          reject(new DOMException('Request aborted while queued', 'AbortError'));
        };
        signal.addEventListener('abort', onAbort, { once: true });
        queueEntry.cleanupAbort = () => signal.removeEventListener('abort', onAbort);
      }

      this.queue.push(queueEntry);
      this._drain();
    });

    if (key) {
      this.inFlightMap.set(key, promise);
      // Clean up in-flight map upon settlement without unhandled rejection
      promise
        .catch(() => {})
        .finally(() => {
          this.inFlightMap.delete(key);
        });
    }

    return promise;
  }

  _drain() {
    while (this.runningCount < this.concurrency && this.queue.length > 0) {
      const entry = this.queue.shift();
      if (!entry) break;

      // Double-check abort before execution
      if (entry.signal && entry.signal.aborted) {
        if (entry.cleanupAbort) entry.cleanupAbort();
        entry.reject(new DOMException('Request aborted', 'AbortError'));
        continue;
      }

      this.runningCount++;

      // Execute task
      Promise.resolve()
        .then(() => entry.taskFn(entry.signal))
        .then((result) => {
          if (entry.cleanupAbort) entry.cleanupAbort();
          entry.resolve(result);
        })
        .catch((err) => {
          if (entry.cleanupAbort) entry.cleanupAbort();
          entry.reject(err);
        })
        .finally(() => {
          this.runningCount--;
          this._drain();
        });
    }
  }

  /**
   * Current queue status for telemetry or debugging.
   */
  getStats() {
    return {
      running: this.runningCount,
      queued: this.queue.length,
      inFlight: this.inFlightMap.size,
    };
  }
}

export const requestQueue = new RequestQueue(4);
