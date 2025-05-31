import mongoose from "mongoose";
import models_list from "./src/models/modelsExport.js";
import { createAdminsFromJSON } from "./src/utils/admin/adminFactory.js";
import { createPetsFromJSON } from "./src/utils/admin/petFactory.js";
import { createPostsFromJSON } from "./src/utils/admin/postFactory.js";

const mongoURI = process.env.MONGO_URI_RAILWAY|| "mongodb://localhost:27017/PetRescueHub";
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

const checkMongoConnection = async () => {
    if (mongoose.connection.readyState === 1) {
        return true;
    }
    return false;
};

const seedDatabase = async () => {
    try {

        const roles = ["super_admin", "admin", "user", "volunteer"];
        const existingRoles = await models_list.Role.find();
        if (existingRoles.length === 0) {
            await models_list.Role.insertMany(roles.map((name) => ({ name })));
        }
    } catch (err) {
        console.error("Error seeding database:", err);
    }
};

export const initializeCollections = async (models) => {
    console.log("🔁 Initializing Mongoose collections...");
    let initializedCount = 0;

    for (const [modelName, model] of Object.entries(models)) {
        try {
            if (model?.prototype instanceof mongoose.Model) {
                await model.init();
                console.log(`✅ Initialized: ${modelName}`);
                initializedCount++;
            } else {
                console.warn(`⚠️ Skipped: ${modelName} is not a valid Mongoose Model`);
            }
        } catch (err) {
            console.error(`❌ Failed to initialize ${modelName}:`, err);
        }
    }

    console.log(`🎉 Initialized ${initializedCount} collections of PetRescueHub.`);
};

const reconnectWithRetry = async (retryCount = 0) => {
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log("✅ Kết nối MongoDB thành công!");
        return true;
    } catch (error) {
        console.error(`❌ Lỗi kết nối MongoDB (Lần thử ${retryCount + 1}/${MAX_RETRIES}):`, error.message);

        if (retryCount < MAX_RETRIES) {
            console.log(`⏳ Đang thử kết nối lại sau ${RETRY_INTERVAL / 1000} giây...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
            return reconnectWithRetry(retryCount + 1);
        } else {
            console.error("❌ Đã vượt quá số lần thử kết nối tối đa!");
            return false;
        }
    }
};

export const connectToDatabase = async () => {
    try {
        console.log("🔄 Đang kiểm tra kết nối MongoDB...");

        const isConnected = await checkMongoConnection();
        if (!isConnected) {
            console.log("📡 Đang thiết lập kết nối mới...");
            const connectionSuccess = await reconnectWithRetry();
            if (!connectionSuccess) {
                throw new Error("Không thể kết nối đến MongoDB sau nhiều lần thử");
            }
        }

        await initializeCollections(models_list);
        await seedDatabase();
        await createAdminsFromJSON("./adminSeed.json");
        await Promise.all([
            createPetsFromJSON("./petSeed.json"),
            createPostsFromJSON("./postSeed.json")
        ])

mongoose.connection.on('disconnected', async () => {
    console.log("⚠️ MongoDB đã ngắt kết nối! Đang thử kết nối lại...");
    await reconnectWithRetry();
})
mongoose.connection.on('error', (error) => {
    console.error("❌ Lỗi kết nối MongoDB:", error);
});

    } catch (err) {
    console.error("❌ Lỗi trong quá trình kết nối database:", err);
    throw err;
}
};

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('📴 Đã đóng kết nối MongoDB an toàn');
        process.exit(0);
    } catch (err) {
        console.error('❌ Lỗi khi đóng kết nối MongoDB:', err);
        process.exit(1);
    }
});
