// import pkg from 'bloom-filters';
// const { BloomFilter } = pkg;
// import redis from "redis";
// import { getData_From_MongoDB } from "../Data/fetchData_MongoDB.js";
// import { MAINDB_MONGODB_DBNAME, MAINDB_MONGODB_URL } from "../../config.js";
// let redisClient1
// try {
//     redisClient1 = redis.createClient();
//     await redisClient.connect();
// } catch (error) {

// }

// export const redisClient = redisClient1

// export const bloomConfig = new BloomFilter(1000, 10);

// const url = MAINDB_MONGODB_URL;
// const dbName = MAINDB_MONGODB_DBNAME;
// const collectionName = 'user';

// redisClient.on('error', (err) => {
//     console.error('Redis error:', err);
// });

// export const fetchDataToCache = async () => {
//     const key = "userCollections";
//     const ttl = 60 * 60; // Time-to-live in seconds - 1 giờ

//     try {
//         const value = await redisClient.get(key);
//         if (!value) {
//             const data = await getData_From_MongoDB(url, dbName, collectionName);
//             await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
//             const usernames = data.map(user => user.username);
//             usernames.forEach(username => {
//                 bloomConfig.add(username);
//             });
//             console.log('Data fetched from MongoDB and cached');
//             return data;
//         } else {
//             console.log('Data fetched from cache');
//             return JSON.parse(value);
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };
// await fetchDataToCache()
// import pkg from 'bloom-filters';
// const { BloomFilter } = pkg;
// import redis from "redis";
// import { getData_From_MongoDB } from "../Data/fetchData_MongoDB.js";
// import { MAINDB_MONGODB_DBNAME, MAINDB_MONGODB_URL } from "../../config.js";

// let redisClient1;

// try {
//     redisClient1 = redis.createClient();
//     await redisClient1.connect();
//     console.log("Redis client connected successfully.");
// } catch (error) {
//     console.error("Failed to initialize Redis client:", error.message);
//     redisClient1 = null; // Dùng để xác định Redis không khả dụng
// }

// export const redisClient = redisClient1;

// export const bloomConfig = new BloomFilter(1000, 10);

// const url = MAINDB_MONGODB_URL;
// const dbName = MAINDB_MONGODB_DBNAME;
// const collectionName = 'user';

// if (redisClient) {
//     redisClient.on('error', (err) => {
//         console.error('Redis error:', err);
//     });
// }

// export const fetchDataToCache = async () => {
//     const key = "userCollections";
//     const ttl = 60 * 60; // Time-to-live in seconds - 1 giờ

//     try {
//         if (!redisClient) {
//             console.warn("Redis client is not initialized. Falling back to MongoDB.");
//             const data = await getData_From_MongoDB(url, dbName, collectionName);
//             console.log('Data fetched directly from MongoDB as Redis is unavailable.');
//             return data;
//         }

//         const value = await redisClient.get(key);
//         if (!value) {
//             const data = await getData_From_MongoDB(url, dbName, collectionName);
//             await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
//             const usernames = data.map(user => user.username);
//             usernames.forEach(username => {
//                 bloomConfig.add(username);
//             });
//             console.log('Data fetched from MongoDB and cached in Redis.');
//             return data;
//         } else {
//             console.log('Data fetched from cache.');
//             return JSON.parse(value);
//         }
//     } catch (error) {
//         console.error('Error fetching data:', error.message);
//         throw error;
//     }
// };


// if (import.meta.url === new URL(import.meta.url).toString()) {
//     try {
//         await fetchDataToCache();
//     } catch (error) {
//         console.error("Failed to fetch data to cache:", error.message);
//     }
// }


import { createClient } from 'redis';
import { getData_From_MongoDB } from "../Data/fetchData_MongoDB.js";
import { MAINDB_MONGODB_DBNAME, MAINDB_MONGODB_URL } from "../../config.js";

const redisClient = createClient({
    username: 'default',
    password: 'kt5KADZ2SRklsGTSPFO1xryLWeJGnp39',
    socket: {
        host: 'redis-12406.c62.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 12406
    }
});
redisClient.on("connect", () => {
    console.log("🔗 Kết nối Redis thành công!");
});
redisClient.on("error", (err) => {
    console.error("❌ Redis Error:", err);
});
await redisClient.connect();

export { redisClient };

const url = MAINDB_MONGODB_URL;
const dbName = MAINDB_MONGODB_DBNAME;
const collectionName = 'user';

export const fetchDataToCache = async () => {
    const key = "userCollections";
    const ttl = 60 * 60; // 1 giờ

    try {
        const value = await redisClient.get(key);
        if (!value) {
            const data = await getData_From_MongoDB(url, dbName, collectionName);
            await redisClient.set(key, JSON.stringify(data), {
                EX: ttl
            });
            console.log('Data fetched from MongoDB and cached in Redis.');
            return data;
        } else {
            console.log('Data fetched from cache.');
            return JSON.parse(value);
        }
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
};

if (import.meta.url === new URL(import.meta.url).toString()) {
    try {
        await fetchDataToCache();
    } catch (error) {
        console.error("Failed to fetch data to cache:", error.message);
    }
}
