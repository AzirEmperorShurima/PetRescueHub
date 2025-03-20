import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: true },
    type: { type: String, enum: ["like", "love", "haha", "sad", "angry"], required: true },
    createdAt: { type: Date, default: Date.now }
});
// 🔥 Middleware: Khi thêm reaction, tự động tăng số lượng trong Comment
ReactionSchema.post("save", async function (doc) {
    await Comment.findByIdAndUpdate(doc.comment, { $inc: { [`reactions.${doc.type}`]: 1 } });
});

// 🔥 Middleware: Khi xóa reaction, tự động giảm số lượng trong Comment
ReactionSchema.post("remove", async function (doc) {
    await Comment.findByIdAndUpdate(doc.comment, { $inc: { [`reactions.${doc.type}`]: -1 } });
});

export default mongoose.model("Reaction", ReactionSchema);
