import { Redis } from '@upstash/redis';
import env from './env.js';

// Configure :: Redis Client
const redis = new Redis({
    url: env.redis.url,
    token: env.redis.token,
});

// Export
export default redis;