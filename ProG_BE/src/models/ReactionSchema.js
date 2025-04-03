import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema(
    {
        authReaction: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reactionType: { type: String, enum: ["like", "love", "haha", "wow", "sad", "angry"], required: true },
        targetType: { type: String, enum: ["Post", "Comment"], required: true },
        targetId: { type: mongoose.Schema.Types.ObjectId, required: true }
    },
    { timestamps: true }
);

// Middleware: Cập nhật số lượng reaction khi thêm mới
ReactionSchema.post("save", async function (doc) {
    try {
        const model = mongoose.model(doc.targetType);
        await model.findByIdAndUpdate(doc.targetId, {
            $inc: { [`reactions.${doc.reactionType}`]: 1 }
        });
    } catch (err) {
        console.error("Error updating reaction count:", err);
    }
});

// Middleware: Cập nhật số lượng reaction khi xoá
ReactionSchema.pre("remove", async function (next) {
    try {
        const model = mongoose.model(this.targetType);
        await model.findByIdAndUpdate(this.targetId, {
            $inc: { [`reactions.${this.reactionType}`]: -1 }
        });
    } catch (err) {
        console.error("Error updating reaction count:", err);
    }
    next();
});

// Index để tối ưu tìm kiếm
ReactionSchema.index({ authReaction: 1, targetType: 1, targetId: 1 });

const Reaction = mongoose.model("Reaction", ReactionSchema);
export default Reaction;
