import redis from "@/database/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
 
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(5, "1m"),
  analytics: true, // Enable analytics to track usage
  prefix: "@upstash/ratelimit", // Optional prefix for Redis keys
});
 
export default ratelimit;