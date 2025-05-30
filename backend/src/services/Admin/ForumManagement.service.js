import { PostModel } from "../../models/PostSchema.js";

export const deletePostService = async (postId) => {
    try {

        const post = await PostModel.findOneAndDelete({ _id: postId });
        if (!post) {
            throw new Error("Post not found");
        }

        return {
            success: true,
            message: "Post deleted successfully",
            postId: post._id
        };
    } catch (err) {
        throw new Error(err.message || "Server error");
    }
};

export const deleteAllPostsService = async () => {
    try {
        await Promise.all([
            mongoose.model("Comment").deleteMany({}),
            mongoose.model("FavouriteList").deleteMany({}),
            mongoose.model("Reaction").deleteMany({ targetType: "Post" })
        ]);
        const result = await PostModel.deleteMany({});

        return {
            success: true,
            message: `Successfully deleted ${result.deletedCount} posts`,
            deletedCount: result.deletedCount
        };
    } catch (err) {
        throw new Error(err.message || "Server error");
    }
};