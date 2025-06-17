import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } from "../../config.js";
import Role, { defaultRole } from "../models/Role.js"
import user from "../models/user.js";


export const create_Roles_Collection_Data = async () => {

    try {
        const RolesLineCount = await Role.estimatedDocumentCount();
        if (RolesLineCount > 0) return;
        const addRoles = await Role.insertMany(
            defaultRole.map(role => ({ name: role }))
        )

        console.log("Default roles created:", Role);
    } catch (error) {
        console.error("Error creating roles:", error);
    }


}

export const create_Default_ADMIN = async () => {
    try {
        const ADMIN = await user.findOne({ email: ADMIN_EMAIL, username: ADMIN_USERNAME })
        if (ADMIN) return;

        const Roles = await Role.find({ name: { $in: ['admin'] } })

        const NewADMIN = await user.create({
            username: ADMIN_USERNAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            roles: Roles.map(r => r._id),
            isActive: true
        })
        console.log(`New admin user created: ${newUser.email}`);
    } catch (error) {
        console.error("Error creating admin:", error);
    }
}