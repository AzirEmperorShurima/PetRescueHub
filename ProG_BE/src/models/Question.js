import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        imageUrls: [{ type: String }],
        tags: [{ type: String, index: true }], // Index giúp tìm kiếm nhanh hơn
        favoriteCount: { type: Number, default: 0 }, // Tổng số lượt yêu thích
        views: { type: Number, default: 0 },
        questionStatus: { type: String, enum: ["open", "hidden"], default: "open" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// 📌 Virtual field: Đếm reaction từ bảng Reaction
QuestionSchema.virtual("reactionCount", {
    ref: "Reaction",
    localField: "_id",
    foreignField: "question",
    count: true
});

// 🔥 Middleware kiểm tra quyền trước khi đăng câu hỏi
// QuestionSchema.pre("save", async function (next) {
//     try {
//         const userPermissions = await mongoose.model("UserPermissions").findOne({ user: this.author });

//         if (!userPermissions) {
//             throw new Error("Không tìm thấy quyền của người dùng!");
//         }
//         if (userPermissions.isBanned) {
//             throw new Error("Bạn đã bị cấm hoạt động!");
//         }
//         if (!userPermissions.canPostQuestion) {
//             throw new Error("Bạn không có quyền đăng câu hỏi!");
//         }

//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// 🔥 Middleware cập nhật `updatedAt` khi chỉnh sửa
QuestionSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

export default mongoose.model("Question", QuestionSchema);
