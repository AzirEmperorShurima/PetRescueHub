import mongoose from "mongoose";


const FavoriteListSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên danh sách yêu thích
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Chủ sở hữu danh sách
    items: [
        {
            postId: { type: mongoose.Schema.Types.ObjectId, required: true },
            // postType: { type: mongoose.Schema.Types.ObjectId, ref: "PostType", required: true },
            // postType: { type: String, enum: ["Question", "ForumPost"], required: true },
            addedAt: { type: Date, default: Date.now },
            importantLevel: { type: Number, min: 1, max: 5, default: 3 }
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

// 🔥 Middleware: Khi xóa danh sách yêu thích, xóa toàn bộ item trong danh sách
// FavoriteListSchema.pre("remove", async function (next) {
//     await mongoose.model("FavoriteItem").deleteMany({ listId: this._id });
//     next();
// });
// FavoriteListSchema.pre("remove", async function (next) {
//     // Duyệt qua tất cả các items trong danh sách yêu thích và cập nhật favoriteCount của bài viết
//     for (const item of this.items) {
//         const model = mongoose.model(item.postType);
//         await model.findByIdAndUpdate(item.postId, { $inc: { favoriteCount: -1 } });
//     }
//     next();
// });

// 🔥 Middleware: Khi thêm vào FavoriteList, cập nhật `favoriteCount` trong bài viết
FavoriteListSchema.post("save", async function (doc) {
    for (const item of doc.items) {
        const model = mongoose.model(item.postType);
        await model.findByIdAndUpdate(item.postId, { $inc: { favoriteCount: 1 } });
    }
});

// 🔥 Middleware: Khi xóa một danh sách, giảm `favoriteCount` của các bài viết
FavoriteListSchema.pre("remove", async function (next) {
    for (const item of this.items) {
        const model = mongoose.model(item.postType);
        await model.findByIdAndUpdate(item.postId, { $inc: { favoriteCount: -1 } });
    }
    next();
});
export default mongoose.model("FavouriteList", FavoriteListSchema);
