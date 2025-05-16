// generate-erd.mjs
import mongoose from "mongoose";
import mongooseErdModule from "mongoose-erd";
import models from "../models/modelsExport.js"; // Đường dẫn models của bạn
import fs from "fs";

const mongooseErd = mongooseErdModule.default ?? mongooseErdModule;

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/PetRescueHub";

// 1. Kết nối MongoDB
await mongoose.connect(mongoURI);
console.log("✅ Đã kết nối MongoDB");

// 2. Đảm bảo các model đã được đăng ký vào mongoose
Object.values(models).forEach((model) => {
    if (typeof model === "function" && model.modelName) {
        mongoose.model(model.modelName, model.schema);
    }
});

// 3. Tạo sơ đồ ERD dưới dạng text .er
const erFilePath = "./erd.mmd";
await mongooseErd.toFile(mongoose, erFilePath);
console.log(`✅ Đã tạo sơ đồ ERD ở: ${erFilePath}`);

// 4. Ngắt kết nối
await mongoose.disconnect();
