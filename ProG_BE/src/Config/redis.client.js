// import { createClient } from 'redis';
// import IORedis from 'ioredis';
// import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME } from './Redis/redis.config.js';

// // Cấu hình chung cho Redis
// const REDIS_CONFIG = {
//     username: REDIS_USERNAME,
//     password: REDIS_PASSWORD,
//     host: REDIS_HOST,
//     port: REDIS_PORT,
//     connectTimeout: 10000,
//     maxRetriesPerRequest: null,
//     retryStrategy: (times) => {
//         const delay = Math.min(100 * Math.pow(2, times), 30000);
//         console.log(`🔄 Thử kết nối lại Redis lần ${times + 1} sau ${delay}ms`);
//         return delay;
//     },
//     reconnectOnError: (err) => {
//         const targetErrors = ['READONLY', 'ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'];
//         return targetErrors.some(e => err.message.includes(e));
//     }
// };

// // Tạo Redis client
// const createRedisClient = () => {
//     const client = createClient({
//         url: `redis://${REDIS_CONFIG.username}:${REDIS_CONFIG.password}@${REDIS_CONFIG.host}:${REDIS_CONFIG.port}`,
//         socket: {
//             connectTimeout: REDIS_CONFIG.connectTimeout,
//             keepAlive: 5000,
//             noDelay: true,
//         },
//         maxRetriesPerRequest: REDIS_CONFIG.maxRetriesPerRequest,
//         retryStrategy: REDIS_CONFIG.retryStrategy,
//         enableOfflineQueue: true,
//     });

//     client.on('connect', () => console.log('🔗 Kết nối Redis thành công'));
//     client.on('ready', () => console.log('✅ Redis đã sẵn sàng'));
//     client.on('error', (err) => console.error('❌ Redis Error:', err));
//     client.on('end', () => console.log('❌ Kết nối Redis đã đóng'));

//     return client;
// };

// // Tạo IORedis client cho BullMQ
// const createIORedisClient = () => {
//     const client = new IORedis({
//         ...REDIS_CONFIG,
//         enableReadyCheck: true,
//         enableOfflineQueue: true,
//         autoResubscribe: true,
//         autoResendUnfulfilledCommands: true,
//         maxRetriesPerRequest: REDIS_CONFIG.maxRetriesPerRequest,
//         connectionName: 'ioredis-bullmq',
//         connectionPoolSize: 10,
//         maxRetriesBeforeError: 20,
//     });

//     client.on('connect', () => console.log('✅ Kết nối IORedis thành công'));
//     client.on('error', (err) => console.error('❌ IORedis Error:', err));
//     client.on('close', () => console.log('❌ Kết nối IORedis đã đóng'));

//     return client;
// };

// const redisClient = createRedisClient();
// const ioRedisClient = createIORedisClient();

// // Health check logic
// const setupHealthCheck = () => {
//     const checkConnection = async (client, type = 'Redis') => {
//         try {
//             if (type === 'Redis' && client.isOpen) {
//                 await client.ping();
//                 // console.log(`🏓 ${type} ping thành công`);
//             } else if (type === 'IORedis' && client.status === 'ready') {
//                 await client.ping();
//                 // console.log(`🏓 ${type} ping thành công`);
//             } else {
//                 console.log(`🔄 ${type} không kết nối, thử kết nối...`);
//                 await (type === 'Redis' ? client.connect() : client.connect());
//             }
//         } catch (error) {
//             console.error(`❌ ${type} ping thất bại:`, error.message);
//             if ((type === 'Redis' && !client.isOpen) || (type === 'IORedis' && client.status !== 'ready')) {
//                 try {
//                     console.log(`🔄 Thử kết nối lại ${type}...`);
//                     await (type === 'Redis' ? client.connect() : client.connect());
//                 } catch (reconnectError) {
//                     console.error(`❌ Không thể kết nối lại ${type}:`, reconnectError.message);
//                 }
//             }
//         }
//     };

//     setInterval(async () => {
//         await Promise.all([
//             checkConnection(redisClient, 'Redis'),
//             checkConnection(ioRedisClient, 'IORedis')
//         ]);
//     }, 15000);
// };

// // Khởi tạo kết nối
// const initializeConnections = async () => {
//     try {
//         const redisConnected = redisClient.isOpen;
//         const ioRedisConnected = ioRedisClient.status === 'ready';

//         const connections = [];
//         if (!redisConnected) {
//             connections.push(redisClient.connect());
//         }
//         if (!ioRedisConnected) {
//             connections.push(ioRedisClient.connect());
//         }

//         if (connections.length > 0) {
//             await Promise.all(connections);
//             console.log('✅ Đã khởi tạo các kết nối cần thiết');
//         } else {
//             console.log('✅ Tất cả kết nối đã tồn tại, bỏ qua khởi tạo');
//         }

//         setupHealthCheck();
//     } catch (error) {
//         console.error('❌ Lỗi khởi tạo kết nối:', error.message);
//         // Retry chỉ khi cần thiết
//         setTimeout(() => {
//             console.log('🔄 Thử lại khởi tạo kết nối...');
//             initializeConnections();
//         }, 5000);
//     }
// };

// // Graceful shutdown
// const shutdown = async () => {
//     try {
//         await Promise.all([
//             redisClient.isOpen ? redisClient.quit() : Promise.resolve(),
//             ioRedisClient.status === 'ready' ? ioRedisClient.quit() : Promise.resolve()
//         ]);
//         console.log('✅ Đã đóng tất cả kết nối Redis');
//     } catch (error) {
//         console.error('❌ Lỗi khi đóng kết nối:', error.message);
//     }
// };

// // Xử lý khi process kết thúc
// process.on('SIGTERM', shutdown);
// process.on('SIGINT', shutdown);

// // Khởi động kết nối
// initializeConnections();

// const sendCommand = (...args) => ioRedisClient.call(...args);

// export { redisClient, ioRedisClient, sendCommand };
import { createClient } from 'redis';
import IORedis from 'ioredis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME } from './Redis/redis.config.js';

const REDIS_CONFIG = {
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    host: REDIS_HOST,
    port: REDIS_PORT,
    connectTimeout: 5000,
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
        const delay = Math.min(times * 100, 1000);
        console.log(`🔄 Redis reconnect attempt ${times + 1} in ${delay}ms`);
        return delay;
    },
    reconnectOnError: (err) => {
        const errors = ['READONLY', 'ETIMEDOUT', 'ECONNRESET', 'ECONNREFUSED'];
        return errors.some(e => err.message.includes(e));
    }
};

// Redis v4 (node-redis)
const createRedisClient = () => {
    const client = createClient({
        socket: {
            host: REDIS_CONFIG.host,
            port: REDIS_CONFIG.port,
            reconnectStrategy: REDIS_CONFIG.retryStrategy,
            connectTimeout: REDIS_CONFIG.connectTimeout
        },
        username: REDIS_CONFIG.username,
        password: REDIS_CONFIG.password
    });

    client.on("connect", () => console.log("🔗 Redis is connected"));
    client.on("ready", () => console.log("✅ Redis is ready"));
    client.on("error", err => console.error("❌ Redis error:", err));
    client.on("reconnecting", () => console.log("🔄 Redis is reconnecting..."));
    client.on("end", () => console.log("❌ Redis connection closed"));

    return client;
};

// IORedis
const createIORedisClient = () => {
    const client = new IORedis({
        host: REDIS_CONFIG.host,
        port: REDIS_CONFIG.port,
        username: REDIS_CONFIG.username,
        password: REDIS_CONFIG.password,
        connectTimeout: REDIS_CONFIG.connectTimeout,
        maxRetriesPerRequest: REDIS_CONFIG.maxRetriesPerRequest,
        retryStrategy: REDIS_CONFIG.retryStrategy,
        reconnectOnError: REDIS_CONFIG.reconnectOnError,
        keepAlive: 10000,
        enableReadyCheck: true,
        enableOfflineQueue: true,
        connectionName: "ioredis-client"
    });

    client.on("connect", () => console.log("✅ IORedis connected"));
    client.on("error", (err) => console.error("❌ IORedis error:", err));

    return client;
};

const redisClient = createRedisClient();
const ioRedisClient = createIORedisClient();

// Kết nối Redis
(async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("❌ Initial Redis connection failed:", err.message);
    }
})();

// Ping kiểm tra định kỳ
setInterval(async () => {
    if (!redisClient.isOpen) {
        console.log("🔄 Redis not open, reconnecting...");
        try {
            await redisClient.connect();
        } catch (err) {
            console.error("❌ Redis reconnect failed:", err.message);
        }
    } else {
        try {
            await redisClient.ping();
        } catch (err) {
            console.error("❌ Redis ping failed:", err.message);
        }
    }

    if (ioRedisClient.status !== 'ready') {
        console.log("🔄 IORedis not ready, reconnecting...");
        try {
            await ioRedisClient.connect();
        } catch (err) {
            console.error("❌ IORedis reconnect failed:", err.message);
        }
    }
}, 10000);

// Command wrapper cho IORedis
const sendCommand = (...args) => ioRedisClient.call(...args);

// Đóng kết nối khi thoát
process.on("SIGINT", async () => {
    console.log("🚦 Shutting down Redis clients...");
    await redisClient.quit();
    await ioRedisClient.quit();
    process.exit(0);
});

export { redisClient, ioRedisClient, sendCommand };
