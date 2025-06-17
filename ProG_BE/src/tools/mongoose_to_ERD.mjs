import mongoose from "mongoose";
import fs from "fs";
import models from "../models/modelsExport.js";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/PetRescueHub";
await mongoose.connect(mongoURI);

const diagramLines = ["erDiagram"];
const addedRelations = new Set();
const relations = [];

function extractRefsFromSchema(schemaObj, refs = [], prefix = "") {
    for (const [key, val] of Object.entries(schemaObj)) {
        if (val == null) continue;

        if (Array.isArray(val)) {
            if (val.length > 0 && typeof val[0] === "object" && val[0].ref) {
                refs.push({ field: prefix + key, ref: val[0].ref });
            } else if (val.length > 0 && typeof val[0] === "object") {
                extractRefsFromSchema(val[0], refs, prefix + key + ".");
            }
        } else if (typeof val === "object") {
            if (val.ref) {
                refs.push({ field: prefix + key, ref: val.ref });
            } else if (val.type && val.type.ref) {
                refs.push({ field: prefix + key, ref: val.type.ref });
            } else {
                extractRefsFromSchema(val, refs, prefix + key + ".");
            }
        }
    }
    return refs;
}

for (const [modelName, model] of Object.entries(models)) {
    const schemaPaths = model.schema.paths;
    const schemaObj = model.schema.obj; // object định nghĩa schema

    const fields = [];

    // Lấy các ref từ schema.obj (để có được cả nested ref)
    const refs = extractRefsFromSchema(schemaObj);

    for (const [fieldName, pathType] of Object.entries(schemaPaths)) {
        if (fieldName === "__v") continue;
        if (/[.\$\*]/.test(fieldName)) continue;

        let fieldType = "string";

        if (pathType.instance === "ObjectID") {
            fieldType = "ObjectId";
        } else {
            fieldType = pathType.instance.toLowerCase();
        }

        const cleanFieldName = fieldName.replace(/\s+/g, "_");
        fields.push(`    ${fieldType} ${cleanFieldName}`);
    }

    // Push entity block
    diagramLines.push(`${modelName.toUpperCase()} {\n${fields.join("\n")}\n}`);

    // Tạo quan hệ dựa trên refs
    for (const { ref } of refs) {
        const relationKey = `${modelName.toUpperCase()}->${ref.toUpperCase()}`;
        if (!addedRelations.has(relationKey)) {
            relations.push(`${modelName.toUpperCase()} ||--o{ ${ref.toUpperCase()} : has`);
            addedRelations.add(relationKey);
        }
    }
}

// Push tất cả quan hệ ra cuối
diagramLines.push(...relations);

fs.writeFileSync("PetRescueHub.mmd", diagramLines.join("\n"), "utf8");
console.log("✅ ERD đã được tạo trong file 'PetRescueHub.mmd'");

await mongoose.disconnect();
