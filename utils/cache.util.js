// Ultra-fast in-memory cache with TTL and prefix invalidation
class SimpleMemoryCache {
    constructor() {
        this.cache = new Map();
    }

    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    set(key, data, ttlSeconds = 60) {
        this.cache.set(key, {
            data,
            expiry: Date.now() + ttlSeconds * 1000,
        });
    }

    delete(key) {
        this.cache.delete(key);
    }

    // Invalidate all keys matching a prefix (e.g. "projects", "services")
    invalidatePrefix(prefix) {
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                this.cache.delete(key);
            }
        }
    }

    clear() {
        this.cache.clear();
    }
}

const memoryCache = new SimpleMemoryCache();

module.exports = memoryCache;
