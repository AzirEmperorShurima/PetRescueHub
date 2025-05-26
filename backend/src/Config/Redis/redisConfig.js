import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME } from './redis.config.js';

export const REDIS_CONFIG = {
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    host: REDIS_HOST,
    port: REDIS_PORT,
    connectTimeout: 5000,
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
        const delay = Math.min(times * 100, 1000);
        console.log(`🔄 Redis reconnect attempt #${times + 1}, retrying in ${delay}ms`);
        return delay;
    },
    reconnectOnError: (err) => {
        const retryErrors = ['READONLY', 'ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'];
        return retryErrors.some(e => err.message.includes(e));
    }
};
