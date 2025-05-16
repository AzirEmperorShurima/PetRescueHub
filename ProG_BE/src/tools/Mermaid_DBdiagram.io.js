import fs from "fs";

// Map tên bảng không đúng → đúng tên bảng thật
const tableAliases = {
    POST: "POSTMODEL",
    COMMENT: "COMMENTMODEL"
};

function resolveTableName(name) {
    return tableAliases[name] || name;
}

function convertMermaidToDbml(mermaidText) {
    const lines = mermaidText.split(/\r?\n/);
    const tables = {};
    const refs = [];

    let currentTable = null;

    for (const line of lines) {
        const trimmed = line.trim();

        // Phát hiện bắt đầu table
        const tableMatch = trimmed.match(/^([A-Z0-9_]+) \{$/);
        if (tableMatch) {
            currentTable = tableMatch[1];
            tables[currentTable] = [];
            continue;
        }

        // Kết thúc table
        if (trimmed === "}") {
            currentTable = null;
            continue;
        }

        // Trong table
        if (currentTable && trimmed) {
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 2) {
                const [typeRaw, ...nameParts] = parts;
                const name = nameParts.join("_");
                let type = typeRaw.toLowerCase();

                // Convert kiểu dữ liệu
                if (["array", "map", "embedded"].includes(type)) type = "json";
                else if (type === "objectid") type = "uuid";
                else if (type === "number") type = "int";

                tables[currentTable].push({ name, type });
            }
            continue;
        }

        // Dòng quan hệ
        const relMatch = trimmed.match(/^([A-Z0-9_]+) \|\|--o\{ ([A-Z0-9_]+) :/);
        if (relMatch) {
            const [_, rawLeft, rawRight] = relMatch;

            const left = resolveTableName(rawLeft);
            const right = resolveTableName(rawRight);

            const tableSet = new Set(Object.keys(tables));
            if (!tableSet.has(left) || !tableSet.has(right)) continue;

            const leftFields = tables[left].map(f => f.name);
            const rightFields = tables[right].map(f => f.name);

            // SELF REFERENCE
            if (left === right) {
                const possibleFK = leftFields.find(name =>
                    name !== "_id" && name.toLowerCase().includes("parent")
                );
                if (possibleFK) {
                    refs.push(`Ref: ${left}.${possibleFK} > ${right}._id`);
                }
                continue;
            }

            const leftKey = leftFields.includes("_id") ? "_id" : "id";
            const rightKey = rightFields.includes("_id") ? "_id" : "id";

            refs.push(`Ref: ${left}.${leftKey} < ${right}.${rightKey}`);
        }
    }

    // Tạo file DBML
    let dbml = "";
    for (const [tableName, fields] of Object.entries(tables)) {
        dbml += `Table ${tableName} {\n`;
        for (const f of fields) {
            dbml += `  ${f.name} ${f.type}\n`;
        }
        dbml += `}\n\n`;
    }

    dbml += refs.join("\n") + "\n";
    return dbml;
}

// ==== THỰC THI ====
const mmdContent = fs.readFileSync("PetRescueHub.mmd", "utf-8");
const dbmlContent = convertMermaidToDbml(mmdContent);
fs.writeFileSync("PetRescueHub.dbml", dbmlContent, "utf8");

console.log("✅ Đã tạo file PetRescueHub.dbml phù hợp dbdiagram.io");
