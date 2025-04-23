import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import { avatarConfig } from "../../config.js";

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
        fullname: {
            type: String,
            default: "Anonymous"
        },
        birthdate: {
            type: Date,
            default: null
        },
        gender: {
            type: String,
            enum: ["male", "female", "not provided"],
            default: "not provided"
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        avatar: {
            type: String,
            default: function () {
                if (this.gender === "male") {
                    return avatarConfig.defaultAvatars.male
                } else if (this.gender === "female") {
                    return avatarConfig.defaultAvatars.female
                } else {
                    return avatarConfig.defaultAvatars.neutral
                }
            }
        },
        phonenumber: [{
            type: String,
        }],
        address: {
            type: String,
        },
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
        isPrivate: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: false
        },
        volunteerRequestStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "none"],
            default: "none"
        },
        isVIP: { type: Boolean, default: false }, // Trạng thái VIP
        premiumExpiresAt: { type: Date } // Ngày hết hạn VIP
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

userSchema.pre("validate", async function (next) {
    const user = this;

    if (!user.id) {
        user.id = uuidv4();
    }

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
    if (!password) throw new Error('Mật khẩu bị thiếu, không thể so sánh!');
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.error('Lỗi khi so sánh mật khẩu!', error.message);
        throw new Error('Lỗi khi so sánh mật khẩu');
    }
};

export default mongoose.model("User", userSchema);