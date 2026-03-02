import { Redis } from "@upstash/redis";

const redis = new Redis({
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  url: process.env.UPSTASH_REDIS_REST_URL!,
});

export { redis };

