import mongoose from "mongoose";

const FavoriteListSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true }, // Tên danh sách yêu thích
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Chủ sở hữu danh sách
        items: [
            {
                postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
                postType: { type: String, enum: ["Question", "ForumPost", "FindLostPetPost", "EventPost"], required: true },
                addedAt: { type: Date, default: Date.now },
                importantLevel: { type: Number, min: 1, max: 5, default: 3 }
            }
        ]
    },
    { timestamps: true }
);

// Middleware: Khi thêm vào FavoriteList, cập nhật `favoriteCount` trong bài viết
FavoriteListSchema.post("save", async function (doc) {
    try {
        for (const item of doc.items) {
            const model = mongoose.model(item.postType);
            await model.findByIdAndUpdate(item.postId, { $inc: { favoriteCount: 1 } });
        }
    } catch (err) {
        console.error("Error updating favorite count:", err);
    }
});

// Middleware: Khi xóa một danh sách, giảm `favoriteCount` của các bài viết
FavoriteListSchema.pre("remove", async function (next) {
    try {
        for (const item of this.items) {
            const model = mongoose.model(item.postType);
            await model.findByIdAndUpdate(item.postId, { $inc: { favoriteCount: -1 } });
        }
    } catch (err) {
        console.error("Error updating favorite count:", err);
    }
    next();
});

// Tạo index để tối ưu tìm kiếm
FavoriteListSchema.index({ user: 1, "items.postId": 1 });

const FavouriteList = mongoose.model("FavouriteList", FavoriteListSchema);
export default FavouriteList;
