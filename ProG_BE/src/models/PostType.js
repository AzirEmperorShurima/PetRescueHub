import mongoose from "mongoose";

const PostTypeSchema = new mongoose.Schema({
    name: { type: String, enum: ["Question", "ForumPost"], required: true, unique: true },
    description: { type: String }, // Mô tả loại bài viết
    permissions: {
        canPost: { type: Boolean, default: true }, // Cho phép đăng bài hay không
        canComment: { type: Boolean, default: true }, // Cho phép bình luận hay không
        canReact: { type: Boolean, default: true }, // Cho phép react hay không
    },
    createdAt: { type: Date, default: Date.now }
});


// async function canUserPost(user, postTypeName) {
//     const postType = await PostTypeSchema.findOne({ name: postTypeName });

//     if (!postType || !postType.permissions.canPost) {
//         throw new Error(`Bạn không có quyền đăng bài thuộc loại ${postTypeName}`);
//     }

//     return true;
// }
export default mongoose.model("PostType", PostTypeSchema);
