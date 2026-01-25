import { redis } from "./redis";

type CacheOptions<T> = {
  deserialize?: (raw: string) => T;
  key: string;
  revalidate?: boolean;
  serialize?: (val: T) => string;
  swrSeconds?: number;
  ttlSeconds?: number;
};

export async function bumpVersion(namespace: string) {
  await redis.incr(`v:${namespace}`);
}

export async function getJSON<T>(key: string): Promise<null | T> {
  const raw = await redis.json.get<T>(key);
  return raw;
}

export async function getOrSet<T>(
  compute: () => Promise<T>,
  opts: CacheOptions<T>
): Promise<T> {
  const {
    deserialize = (v) => JSON.parse(v) as T,
    key,
    revalidate = false,
    serialize = (v) => JSON.stringify(v),
    ttlSeconds,
  } = opts;

  if (!revalidate) {
    const cached = await redis.get<string>(key);

    if (cached) {
      try {
        return deserialize(cached);
      } catch {
        // fallthrough to recompute on parse error
      }
    }
  }

  const data = await compute();
  console.log("data",data);
  
  const serialized = serialize(data);
  console.log("serialized",serialized, !!data);
  
  if (ttlSeconds && ttlSeconds > 0) {
    await redis.set(key, serialized, { ex: ttlSeconds });
  } else {
    await redis.set(key, serialized);
  }
  return data;
}

export async function getVersion(namespace: string): Promise<number> {
  const v = await redis.get<number>(`v:${namespace}`);
  return typeof v === "number" ? v : 0;
}

export async function setJSON<T>(key: string, val: T, ttlSeconds?: number) {
  const raw = JSON.stringify(val);
  if (ttlSeconds && ttlSeconds > 0) {
    await redis.set(key, raw, { ex: ttlSeconds });
  } else {
    await redis.set(key, raw);
  }
}
