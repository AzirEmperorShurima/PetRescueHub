import mongoose from "mongoose";

export const defaultRole = ["admin", "user", "vip", "creator", "censor"];
const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

export default mongoose.model("Role", roleSchema);
