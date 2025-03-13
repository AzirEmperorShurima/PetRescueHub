import mongoose from "mongoose";
import models_list from "./src/models/modelsExport.js";

// export const mongoClient = new mongoose.connect("mongodb://localhost:27017/projectG",{})
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/projectG"
const seedDatabase = async () => {
    try {

        const roles = ["admin", "user", "moderator"];
        const existingRoles = await models_list.Role.find();
        if (existingRoles.length === 0) {
            await models_list.Role.insertMany(roles.map((name) => ({ name })));
            console.log("Default roles added.");
        }
    } catch (err) {
        console.error("Error seeding database:", err);
    }
};


const initializeCollections = async () => {
    try {
        for (const [modelName, model] of Object.entries(models_list)) {
            await model.init();
            console.log(`${modelName} collection initialized.`);
        }
    } catch (err) {
        console.error("Error initializing collections:", err);
    }
};
export const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, {
        });
        console.log("Connected to MongoDB!");
        await initializeCollections();
        await seedDatabase();
    } catch (err) {
        console.error("Database connection error:", err);
    }
};

// connectToDatabase();
