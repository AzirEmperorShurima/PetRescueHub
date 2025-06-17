import { redisClient } from '../Config/redis.client.js';
import { getData_From_MongoDB } from "../Data/fetchData_MongoDB.js";
import { MAINDB_MONGODB_DBNAME, MAINDB_MONGODB_URL } from "../../config.js";

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
