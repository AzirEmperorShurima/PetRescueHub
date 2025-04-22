// import mongoose from "mongoose";

// const ForumPostSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     tags: [{ type: String }],
//     imgUrl: [{ type: String }],
//     favoriteCount: { type: Number, default: 0 }, // Đếm số lần bài viết được thêm vào Favorite
//     postStatus: { type: String, enum: ["open", "hidden"], default: "open" },
//     createdAt: { type: Date, default: Date.now }
// });

// // 🔥 Middleware: Khi xóa bài viết, tự động xóa comment liên quan
// ForumPostSchema.pre("remove", async function (next) {
//     await mongoose.model("Comment").deleteMany({ postId: this._id });
//     next();
// });

// // 🔥 Hàm xử lý reaction
// async function addReaction(postId, type) {
//     const validReactions = ["like", "love", "haha", "sad", "angry"];
//     if (!validReactions.includes(type)) throw new Error("Reaction không hợp lệ!");

//     await mongoose.model("ForumPost").findByIdAndUpdate(postId, { $inc: { [`reactions.${type}`]: 1 } });
// }
// async function removeReaction(postId, type) {
//     const validReactions = ["like", "love", "haha", "sad", "angry"];
//     if (!validReactions.includes(type)) throw new Error("Reaction không hợp lệ!");

//     await mongoose.model("ForumPost").findByIdAndUpdate(postId, { $inc: { [`reactions.${type}`]: -1 } });
// }
// async function getReactions(postId) {
//     const post = await mongoose.model("ForumPost").findById(postId);
//     return post.reactions;
// }

// // Middleware kiểm tra quyền trước khi đăng bài
// // ForumPostSchema.pre("save", async function (next) {
// //     const userPermissions = await UserPermissions.findOne({ user: this.author });

// //     if (!userPermissions) {
// //         throw new Error("Không tìm thấy quyền của người dùng!");
// //     }

// //     if (userPermissions.isBanned) {
// //         throw new Error("Bạn đã bị cấm hoạt động!");
// //     }

// //     if (!userPermissions.canPostForum) {
// //         throw new Error("Bạn không có quyền đăng bài trên diễn đàn!");
// //     }

// //     next();
// // });
// export default mongoose.model("ForumPost", ForumPostSchema);
import mongoose from "mongoose";

const ForumPostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true, trim: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        tags: [{ type: String, index: true }], // Thêm index để tối ưu tìm kiếm
        imgUrl: [{ type: String }],
        favoriteCount: { type: Number, default: 0 }, // Tổng số lượt yêu thích
        postStatus: { type: String, enum: ["open", "hidden"], default: "open" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// 📌 Virtual field: Đếm reaction từ bảng Reaction
ForumPostSchema.virtual("reactionCount", {
    ref: "Reaction",
    localField: "_id",
    foreignField: "post",
    count: true
});

// 🔥 Middleware: Khi xóa bài viết, tự động xóa comment liên quan
ForumPostSchema.pre("remove", async function (next) {
    try {
        await mongoose.model("Comment").deleteMany({ postId: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

// 🔥 Middleware cập nhật `updatedAt` khi chỉnh sửa
ForumPostSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});


export default mongoose.model("ForumPost", ForumPostSchema);
