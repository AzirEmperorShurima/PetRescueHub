import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "postType",
        required: true
    },
    postType: { type: String, enum: ["ForumPost", "Question"], required: true }, // Hỗ trợ nhiều loại post
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    reactions: {
        like: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        haha: { type: Number, default: 0 },
        sad: { type: Number, default: 0 },
        angry: { type: Number, default: 0 }
    },
    depth: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// 🔥 Middleware: Khi thêm comment, tự động cập nhật `replies` của comment cha
CommentSchema.post("save", async function (doc) {
    if (doc.parentComment) {
        await mongoose.model("Comment").findByIdAndUpdate(
            doc.parentComment,
            { $addToSet: { replies: doc._id } }, // Tránh trùng lặp
            { new: true, useFindAndModify: false }
        );
    }
});

// 🔥 Middleware: Khi xóa comment, tự động xóa reaction liên quan và cập nhật `replies`
CommentSchema.post("remove", async function (doc) {
    if (doc.parentComment) {
        await mongoose.model("Comment").findByIdAndUpdate(
            doc.parentComment,
            { $pull: { replies: doc._id } },
            { new: true }
        );
    }
    await mongoose.model("Reaction").deleteMany({ comment: doc._id });
});

// 🔥 Index để tối ưu truy vấn
CommentSchema.index({ postId: 1 });
CommentSchema.index({ parentComment: 1 });
CommentSchema.index({ author: 1 });

export default mongoose.model("Comment", CommentSchema);
