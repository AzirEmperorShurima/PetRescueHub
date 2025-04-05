import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, required: true, trim: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        tags: [{ type: String, index: true }],
        imgUrl: [{ type: String }],
        commentCount: { type: Number, default: 0 },
        favoriteCount: { type: Number, default: 0 },
        postStatus: { type: String, enum: ["public", "private", "hidden"], default: "public" },
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
PostSchema.pre("remove", async function (next) {
    await mongoose.model("Comment").deleteMany({ post: this._id });
    await mongoose.model("FavouriteList").deleteMany({ post: this._id });
    next();
});

// Tạo index để tối ưu tìm kiếm và truy vấn
PostSchema.index({ title: "text", content: "text" });
PostSchema.index({ tags: 1 });
PostSchema.index({ author: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ updatedAt: -1 });

// Định nghĩa model chính
export const PostModel = mongoose.model("Post", PostSchema);

// Định nghĩa các mô hình con với `discriminator`
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
        lostPetInfo: { type: String }
    })
);
export const EventPost = PostModel.discriminator(
    "EventPost",
    new mongoose.Schema({
        eventDate: { type: Date }
    })
);

// Xuất default toàn bộ model chính và các mô hình con
export default {
    PostModel,
    ForumPost,
    Question,
    FindLostPetPost,
    EventPost
};
