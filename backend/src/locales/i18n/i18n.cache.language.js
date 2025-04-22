// import i18next from "i18next";
// import Backend from "i18next-fs-backend";
// import RedisBackend from "i18next-redis-backend";
// import middleware from "i18next-http-middleware";
// import Redis from "ioredis";
// import { redisClient } from "../../Cache/User_Cache";

// i18next
//     .use(RedisBackend)  // Dùng Redis làm bộ nhớ cache
//     .use(Backend)       // Nếu Redis không có dữ liệu, sẽ lấy từ file
//     .use(middleware.LanguageDetector)
//     .init({
//         fallbackLng: "en",
//         preload: ["en", "vi"], // Load trước ngôn ngữ vào bộ nhớ
//         backend: {
//             store: redisClient,  // Lưu vào Redis
//             expirationTime: 60 * 60 * 24, // Cache 24h
//             redisPrefix: "i18n_" // Tiền tố cho key Redis
//         },
//         detection: {
//             order: ["querystring", "cookie", "header"],
//             caches: ["cookie"]
//         }
//     });

// export default i18next;
