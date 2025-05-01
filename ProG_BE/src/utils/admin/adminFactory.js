import fs from "fs";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import models_list from "../../models/modelsExport";

const isPasswordValid = (password) => {
    return (
        typeof password === "string" &&
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /\d/.test(password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
};

export const createAdminsFromJSON = async (jsonPath = "./adminSeed.json") => {
    const rawData = fs.readFileSync(jsonPath, "utf8");
    const users = JSON.parse(rawData);

    for (const user of users) {
        const { email, username, password, secondaryPassword, role } = user;

        if (!isPasswordValid(password)) {
            console.warn(`❌ Password for "${email}" is invalid. Skipping...`);
            continue;
        }

        const existing = await models_list.user.findOne({ email });
        if (existing) {
            console.log(`⚠️ User with email "${email}" already exists. Skipping...`);
            continue;
        }

        const roleDoc = await models_list.Role.findOne({ name: role });
        if (!roleDoc) {
            console.warn(`❌ Role "${role}" not found in database. Skipping...`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedSecondary = secondaryPassword
            ? await bcrypt.hash(secondaryPassword, 10)
            : null;

        const newUser = new models_list.user({
            id: uuidv4(),
            username,
            fullname: "Anonymous System Admin",
            email,
            password: hashedPassword,
            secondaryPassword: hashedSecondary,
            roles: [roleDoc._id],
            isActive: true,
        });

        await newUser.save();
        console.log(`✅ Created user: ${username} (${email})`);
    }
};
