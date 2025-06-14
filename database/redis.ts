import config from "@/lib/config";
import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: config.env.UPSTASH.redisUrl,
    token: config.env.UPSTASH.redisToken,
});
export default redis;