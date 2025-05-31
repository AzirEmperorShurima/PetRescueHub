import fs from "fs";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import models_list from "../../models/modelsExport.js";

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
        const {
            email,
            username,
            password,
            secondaryPassword,
            role,
            fullname,
            birthday,
            gender,
            phone,
            address,
            biography,
            avatar,
            isActive,
            volunteerStatus,
            volunteerRequestStatus,
            isVIP,
            premiumExpiresAt
        } = user;

        if (!isPasswordValid(password)) {
            console.warn(`❌ Password for "${email}" is invalid. Skipping...`);
            continue;
        }

        const existing = await models_list.user.findOne({ email });
        if (existing) {
            console.log(`⚠️ User with email "${email}" already exists. Skipping...`);
            continue;
        }

        // Xử lý roles
        let roles = [];
        if (Array.isArray(role)) {
            for (const roleName of role) {
                const roleDoc = await models_list.Role.findOne({ name: roleName });
                if (roleDoc) {
                    roles.push(roleDoc._id);
                } else {
                    console.warn(`❌ Role "${roleName}" not found in database.`);
                }
            }
        } else {
            const roleDoc = await models_list.Role.findOne({ name: role });
            if (!roleDoc) {
                console.warn(`❌ Role "${role}" not found in database. Skipping...`);
                continue;
            }
            roles = [roleDoc._id];
        }

        const newUser = new models_list.user({
            id: uuidv4(),
            username,
            fullname: fullname || "Anonymous System Admin",
            birthdate: birthday || null,
            gender: gender || "not provided",
            biography: biography || "",
            email,
            phonenumber: phone ? [phone] : [],
            address: address || "",
            password: password,
            secondaryPassword: secondaryPassword,
            roles: roles,
            isActive: isActive !== undefined ? isActive : true,
            volunteerStatus: volunteerStatus || "none",
            volunteerRequestStatus: volunteerRequestStatus || "none",
            isVIP: isVIP || false,
            premiumExpiresAt: premiumExpiresAt ? new Date(premiumExpiresAt) : null,
            avatar: avatar || undefined
        });

        await newUser.save();
        console.log(`✅ Created user: ${username} (${email})`);
    }
};
