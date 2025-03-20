import mongoose from "mongoose";

const PostReactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "ForumPost", required: true },
    type: { type: String, enum: ["like", "love", "haha", "sad", "angry"], required: true },
    createdAt: { type: Date, default: Date.now }
});

// Middleware cập nhật số lượng reaction trong ForumPost
PostReactionSchema.post("save", async function (doc) {
    await ForumPost.findByIdAndUpdate(doc.post, { $inc: { [`reactions.${doc.type}`]: 1 } });
});

PostReactionSchema.post("remove", async function (doc) {
    await ForumPost.findByIdAndUpdate(doc.post, { $inc: { [`reactions.${doc.type}`]: -1 } });
});

export default mongoose.model("PostReaction", PostReactionSchema);
