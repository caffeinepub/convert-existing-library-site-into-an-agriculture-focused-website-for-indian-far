const CACHE_PREFIX = 'agri_cache_';
const CACHE_TIMESTAMP_SUFFIX = '_timestamp';

export function setCachedData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(data));
    localStorage.setItem(CACHE_PREFIX + key + CACHE_TIMESTAMP_SUFFIX, Date.now().toString());
  } catch (error) {
    console.error('Failed to cache data:', error);
  }
}

export function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Failed to retrieve cached data:', error);
    return null;
  }
}

export function getCacheTimestamp(key: string): number | null {
  try {
    const timestamp = localStorage.getItem(CACHE_PREFIX + key + CACHE_TIMESTAMP_SUFFIX);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    return null;
  }
}

export function isOfflineError(error: any): boolean {
  return (
    error?.message?.includes('network') ||
    error?.message?.includes('fetch') ||
    error?.message?.includes('Actor not available') ||
    !navigator.onLine
  );
}
