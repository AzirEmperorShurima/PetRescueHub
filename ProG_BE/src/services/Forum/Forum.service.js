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
export const getListForumPosts = async ({ page = 1, limit = 10, tag, search, postType, sort, userId }) => {
    try {
        const filter = {
            $or: [
                { postStatus: "public" },
                ...(userId ? [{ author: new mongoose.Types.ObjectId(String(userId)) }] : [])
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
            .lean();

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

// export const getRefreshedListForumPosts = async ({
//     page = 1,
//     limit = 10,
//     tag,
//     search,
//     postType,
//     excludeIds = [],
//     userId
// }) => {
//     try {
//         // Điều kiện lọc cơ bản
//         const filter = {
//             $or: [
//                 { postStatus: "public" },
//                 ...(userId ? [{ author: new mongoose.Types.ObjectId(String(userId)) }] : [])
//             ],
//             ...(excludeIds.length > 0 && { _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) } })
//         };

//         if (tag) filter.tags = { $in: [tag] };
//         if (search) filter.$text = { $search: search };
//         if (postType) filter.postType = postType;

//         // Pipeline xử lý danh sách bài viết
//         const postsPipeline = [
//             { $match: filter },
//             // Tính điểm ưu tiên (score) dựa trên createdAt, commentCount, favoriteCount và ngẫu nhiên
//             {
//                 $addFields: {
//                     score: {
//                         $add: [
//                             // Độ mới (createdAt): Chuyển sang timestamp và nhân với trọng số
//                             { $multiply: [{ $toLong: "$createdAt" }, 0.00005] }, // Trọng số thấp để không lấn át
//                             // Số lượt comment: Nhân với trọng số để ưu tiên tương tác
//                             { $multiply: ["$commentCount", 5] },
//                             // Số lượt yêu thích: Nhân với trọng số cao hơn để ưu tiên bài được thích
//                             { $multiply: ["$favoriteCount", 8] },
//                             // Yếu tố ngẫu nhiên: Thêm sự đa dạng
//                             { $multiply: [{ $rand: {} }, 15] }
//                         ]
//                     }
//                 }
//             },
//             // Sắp xếp theo score giảm dần
//             { $sort: { score: -1 } },
//             // Phân trang
//             { $skip: (page - 1) * limit },
//             { $limit: limit },
//             // Lookup thông tin author
//             {
//                 $lookup: {
//                     from: "users",
//                     localField: "author",
//                     foreignField: "_id",
//                     as: "author",
//                     pipeline: [{ $project: { username: 1, avatar: 1 } }]
//                 }
//             },
//             { $unwind: "$author" },
//             // Lấy comment preview
//             {
//                 $lookup: {
//                     from: "comments",
//                     localField: "_id",
//                     foreignField: "post",
//                     as: "comments",
//                     pipeline: [
//                         { $match: { parentComment: null } },
//                         { $sort: { createdAt: -1 } },
//                         { $limit: 1 },
//                         {
//                             $lookup: {
//                                 from: "users",
//                                 localField: "author",
//                                 foreignField: "_id",
//                                 as: "author",
//                                 pipeline: [{ $project: { username: 1 } }]
//                             }
//                         },
//                         { $unwind: "$author" },
//                         { $project: { content: 1, author: "$author.username", createdAt: 1 } }
//                     ]
//                 }
//             },
//             // Kiểm tra favorite
//             {
//                 $lookup: {
//                     from: "favouritelists",
//                     let: { postId: "$_id" },
//                     pipeline: [
//                         {
//                             $match: {
//                                 $expr: {
//                                     $and: [
//                                         { $eq: ["$user", userId ? new mongoose.Types.ObjectId(userId) : null] },
//                                         { $in: ["$$postId", "$items.postId"] }
//                                     ]
//                                 }
//                             }
//                         }
//                     ],
//                     as: "userFavorite"
//                 }
//             },
//             // Đếm tổng comment
//             {
//                 $lookup: {
//                     from: "comments",
//                     localField: "_id",
//                     foreignField: "post",
//                     as: "allComments"
//                 }
//             },
//             // Dự án dữ liệu trả về
//             {
//                 $project: {
//                     title: 1,
//                     content: { $substr: ["$content", 0, 200] },
//                     author: {
//                         id: "$author._id",
//                         username: "$author.username",
//                         avatar: { $ifNull: ["$author.avatar", "default-avatar-url"] }
//                     },
//                     tags: 1,
//                     imgUrl: 1,
//                     commentCount: { $size: "$allComments" },
//                     favoriteCount: 1,
//                     postStatus: 1,
//                     postType: 1,
//                     createdAt: 1,
//                     commentPreview: { $arrayElemAt: ["$comments", 0] },
//                     isLiked: { $gt: [{ $size: "$userFavorite" }, 0] },
//                     score: 1, // Giữ lại score để debug nếu cần
//                     ...(postType === "Question" && { questionDetails: 1 }),
//                     ...(postType === "FindLostPetPost" && { lostPetInfo: 1 }),
//                     ...(postType === "EventPost" && { eventDate: 1 })
//                 }
//             }
//         ];

//         // Thực thi aggregation và đếm tổng số bài viết
//         const [posts, totalPosts] = await Promise.all([
//             PostModel.aggregate(postsPipeline).exec(),
//             PostModel.countDocuments(filter)
//         ]);

//         return { success: true, data: posts, totalPosts };
//     } catch (error) {
//         console.error("Error in getRefreshedListForumPosts:", error);
//         return { success: false, message: "Lỗi server khi lấy danh sách bài ngẫu nhiên", error };
//     }
// };

export const getRefreshedListForumPosts = async ({
    limit = 10,
    cursor = null, // Giá trị score cuối cùng từ lần tải trước
    tag,
    search,
    postType,
    excludeIds = [],
    userId
}) => {
    try {
        // Điều kiện lọc cơ bản
        const filter = {
            $or: [
                { postStatus: "public" },
                ...(userId ? [{ author: new mongoose.Types.ObjectId(userId) }] : [])
            ],
            ...(excludeIds.length > 0 && { _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) } })
        };

        if (tag) filter.tags = { $in: [tag] };
        if (search) filter.$text = { $search: search };
        if (postType) filter.postType = postType;
        if (cursor) filter.score = { $lt: parseFloat(cursor) }; // Lấy các bài có score nhỏ hơn cursor

        // Pipeline xử lý danh sách bài viết
        const postsPipeline = [
            { $match: filter },
            // Tính điểm ưu tiên (score)
            {
                $addFields: {
                    score: {
                        $add: [
                            { $multiply: [{ $toLong: "$createdAt" }, 0.00005] },
                            { $multiply: ["$commentCount", 5] },
                            { $multiply: ["$favoriteCount", 8] },
                            { $multiply: [{ $rand: {} }, 15] }
                        ]
                    }
                }
            },
            { $sort: { score: -1 } }, // Sắp xếp theo score giảm dần
            { $limit: limit }, // Giới hạn số bài trả về
            // Lookup thông tin author
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author",
                    pipeline: [{ $project: { username: 1, avatar: 1 } }]
                }
            },
            { $unwind: "$author" },
            // Lấy comment preview
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post",
                    as: "comments",
                    pipeline: [
                        { $match: { parentComment: null } },
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
                        { $project: { content: 1, author: "$author.username", createdAt: 1 } }
                    ]
                }
            },
            // Kiểm tra favorite
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
            // Đếm tổng comment
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "post",
                    as: "allComments"
                }
            },
            // Dự án dữ liệu trả về
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
                    commentCount: { $size: "$allComments" },
                    favoriteCount: 1,
                    postStatus: 1,
                    postType: 1,
                    createdAt: 1,
                    commentPreview: { $arrayElemAt: ["$comments", 0] },
                    isLiked: { $gt: [{ $size: "$userFavorite" }, 0] },
                    score: 1, // Trả về score để dùng làm cursor
                    ...(postType === "Question" && { questionDetails: 1 }),
                    ...(postType === "FindLostPetPost" && { lostPetInfo: 1 }),
                    ...(postType === "EventPost" && { eventDate: 1 })
                }
            }
        ];

        // Thực thi aggregation và đếm tổng số bài viết
        const posts = await PostModel.aggregate(postsPipeline).exec();
        const totalPosts = await PostModel.countDocuments(filter);

        // Lấy cursor tiếp theo (score của bài cuối cùng)
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].score : null;

        return {
            success: true,
            data: posts,
            totalPosts,
            nextCursor,
            hasNext: posts.length === limit // Nếu trả về đủ limit bài, có thể còn dữ liệu
        };
    } catch (error) {
        console.error("Error in getRefreshedListForumPosts:", error);
        return { success: false, message: "Lỗi server khi lấy danh sách bài ngẫu nhiên", error };
    }
};