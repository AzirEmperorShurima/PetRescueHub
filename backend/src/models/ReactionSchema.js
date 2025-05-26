import mongoose from "mongoose";

const ReactionSchema = new mongoose.Schema(
    {
        authReaction: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reactionType: {
            type: String,
            enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
            required: true,
        },
        targetType: { type: String, required: true },
        targetId: { type: mongoose.Schema.Types.ObjectId, required: true }
    },
    { timestamps: true }
);


ReactionSchema.index({ authReaction: 1, targetType: 1, targetId: 1 }, { unique: true });

// Middleware: Cập nhật số lượng reaction khi thêm mới
ReactionSchema.post('save', async function (doc) {
    try {
        const model = mongoose.model(doc.targetType);
        await model.findByIdAndUpdate(
            doc.targetId,
            { $inc: { [`reactions.${doc.reactionType}`]: 1 } }
        );
    } catch (err) {
        console.error('Error updating reaction count on save:', {
            targetId: doc.targetId,
            reactionType: doc.reactionType,
            error: err.message,
        });
        throw err;
    }
});

// Middleware: Cập nhật số lượng reaction khi xoá
ReactionSchema.pre("deleteOne", async function (next) {
    try {
        const doc = await this.model.findOne(this.getQuery());
        if (!doc) return next();
        
        const model = mongoose.model(doc.targetType);
        await model.findByIdAndUpdate(
            doc.targetId,
            { $inc: { [`reactions.${doc.reactionType}`]: -1 } }
        );
        next();
    } catch (err) {
        console.error('Error updating reaction count on remove:', {
            error: err.message,
        });
        next(err);
    }
});

// Middleware: Cập nhật số lượng reaction khi cập nhật loại reaction
ReactionSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const update = this.getUpdate();
        const oldDoc = await this.model.findOne(this.getQuery());
        
        if (oldDoc && update.$set && update.$set.reactionType && oldDoc.reactionType !== update.$set.reactionType) {
            const model = mongoose.model(oldDoc.targetType);
            await model.findByIdAndUpdate(
                oldDoc.targetId,
                { 
                    $inc: { 
                        [`reactions.${oldDoc.reactionType}`]: -1,
                        [`reactions.${update.$set.reactionType}`]: 1 
                    } 
                }
            );
        }
        next();
    } catch (err) {
        console.error('Error updating reaction count on update:', {
            error: err.message,
        });
        next(err);
    }
});

const Reaction = mongoose.model("Reaction", ReactionSchema);
export default Reaction;
