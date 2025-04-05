import { CommentModel } from "../../models/CommentsSchema.js";
import FavouriteList from "../../models/FavouriteList.js";
import Reaction from "../../models/ReactionSchema.js";
import { PostModel } from "../../models/PostSchema.js";
import mongoose from "mongoose";

/**
 * 📥 Lấy danh sách bài viết trong diễn đàn
 * @param {Object} queryParams - Tham số truy vấn từ client
 * @param {Number} queryParams.page - Số trang cần lấy (mặc định là 1)
 * @param {Number} queryParams.limit - Số bài viết trên mỗi trang (mặc định là 10)
 * @param {String} queryParams.tag - Thẻ bài viết cần tìm kiếm
 * @param {String} queryParams.search - Tiêu đề hoặc nội dung bài viết cần tìm kiếm
 * @param {String} queryParams.postType - Lọc theo loại bài viết (tùy chọn)
 * @returns {Promise<Object>} - Danh sách bài viết
 */
// export const getListForumPosts = async ({ page = 1, limit = 10, tag, search, postType, sort }) => {
//     try {
//         const filter = {
//             postStatus: "public"
//         };
//         if (tag) filter.tags = { $in: [tag] };
//         if (search) filter.$text = { $search: search }; // Sử dụng index text để tìm kiếm tối ưu hơn
//         if (postType) filter.postType = postType; // Lọc theo loại bài viết nếu có

//         const posts = await PostModel.find(filter)
//             .populate("author", "username")
//             .select("-__v")
//             .sort(sort)
//             .skip((page - 1) * limit)
//             .limit(parseInt(limit))
//             .lean();

//         return { success: true, data: posts };
//     } catch (error) {
//         return { success: false, message: "Lỗi server khi lấy danh sách bài viết", error };
//     }
// };
export const getListForumPosts = async ({ page = 1, limit = 10, tag, search, postType, sort, userId }) => {
    try {
        const filter = {
            $or: [
                { postStatus: "public" },
                ...(userId ? [{ author: new mongoose.Types.ObjectId(userId) }] : [])
            ]
        };

        if (tag) filter.tags = { $in: [tag] };
        if (search) filter.$text = { $search: search };
        if (postType) filter.postType = postType;

        const postsPipeline = [
            { $match: filter },
            { $sort: sort },
            { $skip: (page - 1) * limit },
            { $limit: limit },
            // Lookup thông tin author
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [
                        { $project: { username: 1, avatar: 1 } }
                    ]
                }
            },
            { $unwind: "$author" },
            // Lookup bình luận mới nhất
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post",
                    as: "comments",
                    pipeline: [
                        { $match: { parentComment: null } }, // Chỉ lấy comment cấp 1
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            $lookup: {
                                from: "users",
                                localField: "author",
                                foreignField: "_id",
                                as: "author",
                                pipeline: [{ $project: { username: 1 } }]
                            }
                        },
                        { $unwind: "$author" },
                        {
                            $project: {
                                content: 1,
                                author: "$author.username",
                                createdAt: 1,
                                replyCount: { $size: "$replies" }
                            }
                        }
                    ]
                }
            },
            // Lookup trạng thái favorite của user
            {
                $lookup: {
                    from: "favouritelists",
                    let: { postId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$user", userId ? new mongoose.Types.ObjectId(userId) : null] },
                                        { $in: ["$$postId", "$items.postId"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userFavorite"
                }
            },
            // Lookup reactions
            {
                $lookup: {
                    from: "reactions",
                    localField: "_id",
                    foreignField: "targetId",
                    as: "reactions",
                    pipeline: [
                        { $match: { targetType: "Post" } },
                        { $group: { _id: "$reactionType", count: { $sum: 1 } } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post",
                    as: "allComments"
                }
            },
            {
                $addFields: {
                    commentCount: { $size: "$allComments" }
                }
            },
            {
                $project: {
                    allComments: 0, // Ẩn mảng allComments để giảm tải dữ liệu
                    // Các trường khác giữ nguyên
                }
            },
            {
                $project: {
                    title: 1,
                    content: { $substr: ["$content", 0, 200] },
                    author: {
                        id: "$author._id",
                        username: "$author.username",
                        avatar: { $ifNull: ["$author.avatar", "default-avatar-url"] }
                    },
                    tags: 1,
                    imgUrl: 1,
                    commentCount: 1,
                    favoriteCount: 1,
                    postStatus: 1,
                    postType: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    commentPreview: { $arrayElemAt: ["$comments", 0] },
                    isLiked: { $gt: [{ $size: "$userFavorite" }, 0] },
                    reactions: {
                        $arrayToObject: {
                            $map: {
                                input: "$reactions",
                                as: "reaction",
                                in: { k: "$$reaction._id", v: "$$reaction.count" }
                            }
                        }
                    },
                    ...(postType === "Question" && { questionDetails: 1 }),
                    ...(postType === "FindLostPetPost" && { lostPetInfo: 1 }),
                    ...(postType === "EventPost" && { eventDate: 1 })
                }
            }
        ];

        const posts = await PostModel.aggregate(postsPipeline).exec();

        return { success: true, data: posts };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Lỗi server khi lấy danh sách bài viết", error };
    }
};

/**
 * 📥 Lấy thông tin bài viết theo ID
 * @param {String} id - ID của bài viết cần lấy
 * @returns {Promise<Object>} - Bài viết tìm thấy hoặc thông báo lỗi
 */
export const getPostById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { success: false, message: "ID không hợp lệ" };
        }

        const post = await PostModel.findById(id)
            .populate("author", "username")
            .lean(); // Tăng tốc truy vấn

        if (!post) return { success: false, message: "Bài viết không tồn tại" };

        return { success: true, data: post };
    } catch (error) {
        return { success: false, message: "Lỗi server khi lấy bài viết", error };
    }
};

/**
 * 📥 Tạo bài viết mới
 * @param {String} title - Tiêu đề bài viết
 * @param {String} content - Nội dung bài viết
 * @param {Array} tags - Các thẻ bài viết
 * @param {Array} imgUrl - Các URL ảnh trong bài viết
 * @param {String} userId - ID người dùng tạo bài viết
 * @param {String} postType - Loại bài viết (mặc định là "ForumPost")
 * @returns {Promise<Object>} - Bài viết mới được tạo
 */
export const createPost = async (title, content, tags, imgUrl, userId, postType = "ForumPost") => {
    try {
        // Kiểm tra đầu vào
        if (!title?.trim() || !content?.trim() || !userId) {
            return { success: false, message: "Thiếu thông tin cần thiết" };
        }
        console.log("Creating post with data:", { title, content, tags, imgUrl, userId, postType }); // Debug log
        console.log(PostModel); // Debug log
        const normalizedTags = Array.isArray(tags) ? tags : tags ? [tags] : [];
        const normalizedImgUrl = Array.isArray(imgUrl) ? imgUrl : imgUrl ? [imgUrl] : [];
        console.log("Normalized tags and imgUrl:", { normalizedTags, normalizedImgUrl }); // Debug log
        const newPost = new PostModel({
            title: title.trim(),
            content: content.trim(),
            author: new mongoose.Types.ObjectId(userId),
            tags: normalizedTags,
            imgUrl: normalizedImgUrl,
            postType,
            postStatus: "public",
        });
        console.log("New post data:", newPost); // Debug log
        await newPost.save();
        return { success: true, message: "Đăng bài thành công!", post: newPost };
    } catch (error) {
        console.error("❌ Lỗi khi tạo bài viết:", error);
        return { success: false, message: "Lỗi service server khi đăng bài", error };
    }
};


/**
 * 📥 Cập nhật bài viết diễn đàn
 * @param {String} postId - ID bài viết cần cập nhật
 * @param {String} userId - ID người dùng yêu cầu cập nhật
 * @param {Object} updateData - Dữ liệu cần cập nhật (title, content, tags, imgUrl, postStatus)
 * @returns {Promise<Object>} - Bài viết đã được cập nhật hoặc thông báo lỗi
 */
export const updatePost = async (postId, userId, updateData) => {
    try {
        if (Object.keys(updateData).length === 0) {
            return { success: false, message: "Không có dữ liệu hợp lệ để cập nhật" };
        }

        const post = await PostModel.findOneAndUpdate(
            { _id: postId, author: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!post) {
            return { success: false, message: "Không có quyền cập nhật hoặc bài viết không tồn tại" };
        }
        return { success: true, message: "Cập nhật thành công", post };
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật bài viết:", error);
        return { success: false, message: "Lỗi server khi cập nhật bài viết", error };
    }
};


/**
 * 🗑 Xóa bài viết diễn đàn
 * @param {String} postId - ID bài viết cần xóa
 * @param {String} userId - ID người dùng yêu cầu xóa
 * @returns {Promise<Object>} - Kết quả xóa bài viết
 */
export const deletePost = async (postId, userId) => {
    try {
        // Kết hợp findOneAndDelete với lean() để tối ưu hiệu suất
        const post = await PostModel.findOneAndDelete(
            { _id: postId, author: userId },
            { lean: true }
        ).exec();

        if (!post) {
            return { success: false, message: "Không có quyền xóa hoặc bài viết không tồn tại" };
        }

        // Thực hiện các thao tác xóa song song với error handling riêng
        await Promise.all([
            CommentModel.deleteMany({ postId }).exec().catch(err => {
                console.error('Error deleting comments:', err.message);
                throw err; // Có thể bỏ throw nếu muốn tiếp tục dù lỗi
            }),
            Reaction.deleteMany({ targetId: postId }).exec().catch(err => {
                console.error('Error deleting reactions:', err.message);
                throw err;
            }),
            FavouriteList.updateMany(
                { "items.postId": postId },
                { $pull: { items: { postId } } }
            ).exec().catch(err => {
                console.error('Error updating favourites:', err.message);
                throw err;
            })
        ]);

        return { success: true, message: "Xóa bài viết thành công!" };
    } catch (error) {
        console.error('Delete post error:', { postId, error: error.message });
        return {
            success: false,
            message: error.message || "Lỗi server khi xóa bài viết",
            error: error.message
        };
    }
};

// export const deletePost = async (postId, userId) => {
//     const session = await PostModel.startSession();
//     session.startTransaction();

//     try {
//         // Sử dụng findOneAndDelete thay vì find + delete riêng lẻ
//         const deletedPost = await PostModel.findOneAndDelete(
//             { _id: postId, author: userId },
//             { session }
//         );

//         if (!deletedPost) {
//             throw new Error("Không có quyền xóa hoặc bài viết không tồn tại");
//         }

//         // Thực hiện các thao tác xóa song song
//         await Promise.all([
//             CommentModel.deleteMany({ postId }).session(session),
//             Reaction.deleteMany({ targetId: postId }).session(session),
//             FavouriteList.updateMany(
//                 { "items.postId": postId },
//                 { $pull: { items: { postId } } }
//             ).session(session)
//         ]);

//         await session.commitTransaction();
//         return { success: true, message: "Xóa bài viết thành công!" };
//     } catch (error) {
//         await session.abortTransaction();
//         console.error('Delete post error:', error);

//         return {
//             success: false,
//             message: error.message || "Lỗi server khi xóa bài viết",
//             error: process.env.NODE_ENV === 'development' ? error : undefined
//         };
//     } finally {
//         session.endSession();
//     }
// };