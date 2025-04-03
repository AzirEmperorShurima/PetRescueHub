import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
        content: { type: String, required: true, trim: true },
        parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // Hỗ trợ comment lồng nhau
        replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// Middleware: Tự động cập nhật `updatedAt` khi chỉnh sửa comment
CommentSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Middleware: Khi tạo comment mới, nếu có parentComment thì thêm vào replies của parent
CommentSchema.post("save", async function (doc) {
    if (doc.parentComment) {
        await mongoose.model("Comment").findByIdAndUpdate(doc.parentComment, {
            $push: { replies: doc._id }
        });
    }
});
CommentSchema.pre("remove", async function (next) {
    if (this.parentComment) {
        await mongoose.model("Comment").findByIdAndUpdate(this.parentComment,
            {
                $pull: { replies: this._id }
            });
    }
    next();
});
CommentSchema.index({ post: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });
CommentSchema.index({ parentComment: 1 });
export const CommentModel = mongoose.model("Comment", CommentSchema);
