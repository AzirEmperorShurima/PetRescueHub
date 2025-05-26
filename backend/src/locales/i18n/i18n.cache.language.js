import i18next from "i18next";
import FsBackend from "i18next-fs-backend";
import RedisBackend from "i18next-redis-backend";
import middleware from "i18next-http-middleware";
import path from "path";
import { redisClient } from "../../Cache/User_Cache";

// Khởi tạo i18next
i18next
    .use(middleware.LanguageDetector)
    .use({
        type: 'backend',
        init: () => { },
        read: (...args) => {
            const [language, namespace, callback] = args;
            RedisBackend.prototype.read.call({
                redis: redisClient,
                options: {
                    expirationTime: 60 * 60 * 24, // 24h
                    redisPrefix: "i18n_"
                }
            }, language, namespace, (err, data) => {
                if (data) return callback(null, data);
                FsBackend.prototype.read.call({
                    services: {},
                    options: {
                        loadPath: path.join(__dirname, "../../locales/{{lng}}/{{ns}}.json")
                    }
                }, language, namespace, callback);
            });
        }
    })
    .init({
        fallbackLng: "en",  
        preload: ["en", "vi"],
        ns: ["translation"],  
        defaultNS: "translation",
        detection: {
            order: ["querystring", "cookie", "header"],
            caches: ["cookie"]
        },
        interpolation: {
            escapeValue: false,
        }
    });

export const i18n = i18next;
export const i18nMiddleware = middleware.handle(i18next);
