import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import { createHash256, encrypt, MASTER_PRIVARE_KEY } from "../utils/crypto_js.js";

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            required: true
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        // phonenumber: {
        //     type: String,
        // },
        password: {
            type: String,
            required: true,
        },
        tokens: [{ type: Object }],
        roles: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Role",
            },
        ],
        isActive: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
userSchema.pre("validate", async function (next) {
    const user = this;

    // Kiểm tra nếu `id` chưa tồn tại
    // if (!user.id) {
    //     let prefix = "us"; // Mặc định là `user`

    //     // Xác định prefix theo role
    //     if (user.roles && user.roles.length > 0) {
    //         const roleName = user.roles[0].name; // Giả sử `roles` chứa object với key `name`
    //         if (roleName === "admin") prefix = "ad";
    //     }

    //     // Tạo hash ngẫu nhiên
    //     const timestamp = Date.now().toString(36); // Chuyển timestamp sang base 36
    //     const hash = crypto.randomBytes(4).toString("hex"); // 8 ký tự hex
    //     user.id = `${prefix}-${timestamp}-${hash}`;

    // }
    if (!user.id) {
        user.id = uuidv4();
    }
    // const encryptedUserName = createHash256(user.username, MASTER_PRIVARE_KEY);
    // const encryptedEmail =  createHash256(user.email, MASTER_PRIVARE_KEY);
    // user.username = encryptedUserName;
    // user.email = encryptedEmail;

    next();
});

userSchema.statics.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async function (password, receivedPassword) {
    return await bcrypt.compare(password, receivedPassword);
};

userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});

userSchema.methods.comparePassword = async function (password) {
    if (!password) throw new Error('Password is missing, cannot compare!');
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error('Error while comparing password!', error.message);
        throw new Error('Error while comparing password');
    }
};

export default mongoose.model("User", userSchema);
