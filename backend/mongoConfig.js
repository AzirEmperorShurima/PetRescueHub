import mongoose from "mongoose";
import models_list from "./src/models/modelsExport.js";

// export const mongoClient = new mongoose.connect("mongodb://localhost:27017/projectG",{})
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/PetRescueHub";
const seedDatabase = async () => {
    try {

        const roles = ["admin", "user", "volunteer"];
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
            // Kiểm tra model có phải là Mongoose Model không
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


export const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, {
        });
        console.log("Connected to MongoDB!");
        await initializeCollections(models_list);
        await seedDatabase();
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

// connectToDatabase();
