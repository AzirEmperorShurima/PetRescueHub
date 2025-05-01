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
        biography: {
            type: String,
            default: ""
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
        secondaryPassword: {
            type: String,
            default: null,
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
        isCompromised: {
            type: Boolean,
            default: false
        },
        volunteerStatus: {
            type: String,
            enum: ["alreadyRescue", "not ready", "none"],
            default: "none"
        },
        volunteerRequestStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "none"],
            default: "none"
        },
        isVIP: { type: Boolean, default: false },
        premiumExpiresAt: { type: Date }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Middleware để tự động cập nhật volunteerStatus dựa trên roles
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("roles") || user.isNew) {
        await user.populate("roles");
        const hasVolunteerRole = user.roles.some(role => role.name.toLowerCase() === "volunteer");

        if (hasVolunteerRole) {
            // Nếu có role volunteer, đảm bảo volunteerStatus là alreadyRescue hoặc not ready
            if (!["alreadyRescue", "not ready"].includes(user.volunteerStatus)) {
                user.volunteerStatus = "not ready"; // Mặc định khi mới thêm role volunteer
            }
        } else {
            // Nếu không có role volunteer, đặt volunteerStatus là none
            user.volunteerStatus = "none";
        }
    }

    next();
});

// Middleware để xử lý cập nhật roles qua findOneAndUpdate
userSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (update.roles) {
        const roles = await mongoose.model("Role").find({ _id: { $in: update.roles } });
        const hasVolunteerRole = roles.some(role => role.name.toLowerCase() === "volunteer");

        this.set({
            volunteerStatus: hasVolunteerRole ? (update.volunteerStatus || "not ready") : "none"
        });
    }
    next();
});

// Middleware để tạo id tự động
userSchema.pre("validate", async function (next) {
    const user = this;
    if (!user.id) {
        user.id = uuidv4();
    }
    next();
});

// Phương thức mã hóa mật khẩu
userSchema.statics.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Phương thức so sánh mật khẩu
userSchema.statics.comparePassword = async function (password, receivedPassword) {
    return await bcrypt.compare(password, receivedPassword);
};

// Middleware để mã hóa mật khẩu trước khi lưu
userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    if (user.isModified("secondaryPassword") && user.secondaryPassword) {
        const hash = await bcrypt.hash(user.secondaryPassword, 10);
        user.secondaryPassword = hash;
    }

    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
});

// Phương thức so sánh mật khẩu của instance
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