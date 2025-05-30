import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true, trim: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        tags: [{ type: String, index: true }],
        violate_tags: [{ type: String, index: true }],
        violationDetails: [{
            tag: { type: String, required: true },
            reason: { type: String, required: true },
            triggerPhrase: { type: String, default: "" }
        }],
        imgUrl: [{ type: String }],
        commentCount: { type: Number, default: 0 },
        favoriteCount: { type: Number, default: 0 },
        reactions: {
            type: Map,
            of: Number,
            default: () => new Map([
                ['like', 0],
                ['love', 0],
                ['haha', 0],
                ['wow', 0],
                ['sad', 0],
                ['angry', 0],
            ]),
        },
        postStatus: {
            type: String, enum: ["public", "private", "hidden", "pending"], default: "public"
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    { timestamps: true, discriminatorKey: "postType" }
);

// Middleware cập nhật thời gian `updatedAt` trước khi cập nhật
PostSchema.pre("findOneAndUpdate", function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Middleware xóa liên quan khi xóa bài viết
PostSchema.pre("deleteOne", async function (next) {
    try {
        await Promise.all([
            mongoose.model("Comment").deleteMany({ post: this._id }),
            mongoose.model("FavouriteList").deleteMany({ post: this._id }),
            mongoose.model("Reaction").deleteMany({ targetType: "Post", targetId: this._id })
        ]);
        next();
    } catch (error) {
        next(error);
    }
});

PostSchema.index({ 'reactions.like': 1 });
PostSchema.index({ title: "text", content: "text" });
PostSchema.index({ author: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ updatedAt: -1 });

export const PostModel = mongoose.model("Post", PostSchema);
export const ForumPost = PostModel.discriminator("ForumPost", new mongoose.Schema({}));
export const Question = PostModel.discriminator(
    "Question",
    new mongoose.Schema({
        questionDetails: { type: String }
    })
);
export const FindLostPetPost = PostModel.discriminator(
    "FindLostPetPost",
    new mongoose.Schema({
        lostPetInfo: { type: String },
        contactInfo: {
            type: {
                phoneNumber: { type: String },
                email: { type: String },
                address: { type: String },
                breed: { type: String },
                breedName: { type: String },
                petColor: { type: String },
                petAge: { type: Number },
                petGender: { type: String },
                petDetails: { type: String },
            }
        },
    })
);
export const EventPost = PostModel.discriminator(
    "EventPost",
    new mongoose.Schema({
        eventStartDate: { type: Date },
        eventEndDate: { type: Date },
        eventLongitude: { type: String }, //kinh độ
        eventLatitude: { type: String }, //vĩ độ
        eventLocation: { type: String },
        postStatus: { type: String, enum: ["public", "private", "hidden", "pending"], default: "hidden" },
        approvalStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    })
);
export default {
    PostModel,
    ForumPost,
    Question,
    FindLostPetPost,
    EventPost
};
