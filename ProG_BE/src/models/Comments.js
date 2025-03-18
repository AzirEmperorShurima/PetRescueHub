import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "postType",
        required: true
    },
    // postType: { type: mongoose.Schema.Types.ObjectId, ref: "PostType", required: true },
    postType: { type: String, enum: ["Question", "ForumPost"], required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    reactions: {
        like: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        haha: { type: Number, default: 0 },
        sad: { type: Number, default: 0 },
        angry: { type: Number, default: 0 }
    },
    reactionDetails: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reaction" }],
    depth: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
CommentSchema.post("save", async function (doc) {
    if (doc.parentComment) {
        await mongoose.model("Comment").findByIdAndUpdate(
            doc.parentComment,
            { $push: { replies: doc._id } },
            { new: true, useFindAndModify: false }
        );
    }
});
CommentSchema.post("remove", async function (doc) {
    if (doc.parentComment) {
        await mongoose.model("Comment").findByIdAndUpdate(
            doc.parentComment,
            { $pull: { replies: doc._id } },
            { new: true }
        );
    }
});

// CommentSchema.pre("save", async function (next) {
//     const userPermissions = await UserPermissions.findOne({ user: this.author });

//     if (!userPermissions) {
//         throw new Error("Không tìm thấy quyền của người dùng!");
//     }

//     if (userPermissions.isBanned) {
//         throw new Error("Bạn đã bị cấm hoạt động!");
//     }

//     if (!userPermissions.canComment) {
//         throw new Error("Bạn không có quyền bình luận!");
//     }

//     next();
// });
export default mongoose.model("Comment", CommentSchema);
