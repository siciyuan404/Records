type CacheItem<T> = {
  data: T;
  expiry: number;
};

const cache: Record<string, CacheItem<any>> = {};

export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 默认缓存 5 分钟
): Promise<T> {
  const now = Date.now();
  const cached = cache[key];

  if (cached && now < cached.expiry) {
    return cached.data;
  }

  const data = await fetchFn();
  cache[key] = { data, expiry: now + ttl };
  return data;
}
