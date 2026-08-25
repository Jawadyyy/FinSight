import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Stale-while-revalidate for read endpoints.
 *
 * The dashboard tabs re-mount every time you switch to them, and each one used
 * to refetch from scratch — so every visit showed a skeleton, even for data
 * that had not changed. This keeps the last result in a module-level cache:
 *
 *  - cache hit  -> return it immediately (no skeleton) and refetch in the
 *                  background, so the screen updates silently if anything changed.
 *  - cache miss -> show the skeleton once, fetch, store.
 *
 * The cache lives for the tab's lifetime (a page reload clears it), which is the
 * right lifetime for "don't flash a skeleton while I click around".
 */
const cache = new Map<string, unknown>();

/** Drop cached entries so the next read refetches. Pass a prefix after a
 *  mutation (e.g. 'overview') to invalidate everything under it. */
export function invalidateCache(prefix?: string): void {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}

export function useCachedResource<T>(key: string, fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | undefined>(
    () => cache.get(key) as T | undefined,
  );
  const [loading, setLoading] = useState(!cache.has(key));
  const [error, setError] = useState(false);

  // The fetcher is usually an inline arrow, new every render; keep the latest in
  // a ref so load() does not need it as a dependency and re-run on every render.
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(async () => {
    if (!cache.has(key)) setLoading(true);
    try {
      const result = await fetcherRef.current();
      cache.set(key, result);
      setData(result);
      setError(false);
    } catch {
      // A failed background refresh keeps the last good data on screen. Only a
      // first load with nothing cached surfaces as an error, so the page can
      // show a retry instead of an endless skeleton.
      if (!cache.has(key)) setError(true);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    // On key change, show that key's cached value (or a skeleton if none) and
    // revalidate.
    setData(cache.get(key) as T | undefined);
    setLoading(!cache.has(key));
    setError(false);
    void load();
  }, [key, load]);

  return { data, loading, error, refresh: load };
}
