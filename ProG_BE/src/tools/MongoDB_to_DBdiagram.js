// === MODULE: convert-mongoose-schema.js ===
// Convert Mongoose Schemas -> Mermaid ERD (.mmd) -> DBML for dbdiagram.io

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import models from "../models/modelsExport.js";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/PetRescueHub";
await mongoose.connect(mongoURI);

const OUTPUT_DIR = "./output";
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const diagramLines = ["erDiagram"];
const addedRelations = new Set();
const relations = [];

function extractRefsFromSchema(schemaObj, refs = [], prefix = "") {
  for (const [key, val] of Object.entries(schemaObj)) {
    if (!val) continue;
    if (Array.isArray(val)) {
      if (val[0] && typeof val[0] === "object" && val[0].ref) {
        refs.push({ field: prefix + key, ref: val[0].ref });
      } else if (val[0] && typeof val[0] === "object") {
        extractRefsFromSchema(val[0], refs, prefix + key + ".");
      }
    } else if (typeof val === "object") {
      if (val.ref) refs.push({ field: prefix + key, ref: val.ref });
      else if (val.type && val.type.ref) refs.push({ field: prefix + key, ref: val.type.ref });
      else extractRefsFromSchema(val, refs, prefix + key + ".");
    }
  }
  return refs;
}

const modulesMap = {};
const aliasTracker = {};

for (const [modelName, model] of Object.entries(models)) {
  const schemaPaths = model.schema.paths;
  const schemaObj = model.schema.obj;
  const fields = [];

  const refs = extractRefsFromSchema(schemaObj);

  for (const [fieldName, pathType] of Object.entries(schemaPaths)) {
    if (fieldName === "__v") continue;
    let fieldType = "string";

    if (pathType.instance === "ObjectID") fieldType = "objectid";
    else if (pathType.instance === "Array") fieldType = "array";
    else if (pathType.instance === "Map") fieldType = "map";
    else if (pathType.instance === "Embedded") fieldType = "embedded";
    else fieldType = pathType.instance.toLowerCase();

    const cleanField = fieldName.replace(/[^a-zA-Z0-9_]/g, "_");
    fields.push(`    ${fieldType} ${cleanField}`);
  }

  const moduleName = model.modelName.split(/(?=[A-Z])/)[0].toUpperCase();
  if (!modulesMap[moduleName]) modulesMap[moduleName] = [];
  modulesMap[moduleName].push(model.modelName.toUpperCase());
  aliasTracker[model.modelName.toUpperCase()] = true;

  diagramLines.push(`${model.modelName.toUpperCase()} {\n${fields.join("\n")}\n}`);

  for (const { ref } of refs) {
    const key = `${model.modelName.toUpperCase()}->${ref.toUpperCase()}`;
    if (!addedRelations.has(key)) {
      relations.push(`${model.modelName.toUpperCase()} ||--o{ ${ref.toUpperCase()} : has`);
      addedRelations.add(key);
    }
  }
}

diagramLines.push(...relations);
fs.writeFileSync(path.join(OUTPUT_DIR, "erd.mmd"), diagramLines.join("\n"));
console.log("✅ Generated erd.mmd");

// === Convert to DBML ===
const mmdText = fs.readFileSync(path.join(OUTPUT_DIR, "erd.mmd"), "utf-8");

const lines = mmdText.split(/\r?\n/);
const dbmlTables = {};
const dbmlRefs = [];
let currentTable = null;

for (const line of lines) {
  const tableMatch = line.match(/^([A-Z0-9_]+) \{$/);
  if (tableMatch) {
    currentTable = tableMatch[1];
    dbmlTables[currentTable] = [];
    continue;
  }
  if (line.trim() === "}") {
    currentTable = null;
    continue;
  }
  if (currentTable && line.trim()) {
    const parts = line.trim().split(/\s+/);
    const [typeRaw, ...nameParts] = parts;
    const name = nameParts.join("_");
    let type = typeRaw.toLowerCase();
    if (["array", "map", "embedded"].includes(type)) type = "json";
    if (type === "objectid") type = "uuid";
    if (type === "number") type = "int";
    dbmlTables[currentTable].push({ name, type });
  }

  const relMatch = line.match(/^([A-Z0-9_]+) \|\|--o\{ ([A-Z0-9_]+) :/);
  if (relMatch) {
    let [_, left, right] = relMatch;
    left = aliasTracker[left] ? left : `${left}MODEL`;
    right = aliasTracker[right] ? right : `${right}MODEL`;

    if (!dbmlTables[left] || !dbmlTables[right]) continue;

    if (left === right) {
      const selfField = dbmlTables[left]?.find(f => f.name !== "_id" && f.name.toLowerCase().includes("parent"));
      if (selfField) {
        dbmlRefs.push(`Ref: ${left}.${selfField.name} > ${right}._id`);
      }
      continue;
    }

    const lKey = dbmlTables[left].some(f => f.name === "_id") ? "_id" : "id";
    const rKey = dbmlTables[right].some(f => f.name === "_id") ? "_id" : "id";
    dbmlRefs.push(`Ref: ${left}.${lKey} < ${right}.${rKey}`);
  }
}

let dbml = "";
for (const [tableName, fields] of Object.entries(dbmlTables)) {
  dbml += `Table ${tableName} {\n`;
  for (const field of fields) {
    const pk = field.name === "_id" ? " [pk]" : "";
    dbml += `  ${field.name} ${field.type}${pk}\n`;
  }
  dbml += `}\n\n`;
}
dbml += dbmlRefs.join("\n") + "\n";
fs.writeFileSync(path.join(OUTPUT_DIR, "schema.dbml"), dbml);
console.log("✅ Generated schema.dbml");

await mongoose.disconnect();
