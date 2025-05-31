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

export const getListForumPosts = async ({ page = 1, limit = 10, tag, search, postType, sort = { createdAt: -1 }, userId }) => {
    try {
        const filter = {
            $or: [
                { postStatus: 'public' },
                ...(userId ? [{ author: new mongoose.Types.ObjectId(userId) }] : []),
            ],
        };

        if (tag) filter.tags = { $in: [tag] };
        if (search) filter.$text = { $search: search };
        if (postType) filter.postType = postType;

        const postsPipeline = [
            { $match: filter },
            { $sort: sort }, // Sắp xếp theo sort, mặc định createdAt giảm dần
            { $skip: (page - 1) * limit },
            { $limit: limit },
            // Lookup thông tin author
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                    pipeline: [{ $project: { username: 1, avatar: 1 } }],
                },
            },
            { $unwind: '$author' },
            // Lookup bình luận mới nhất (chỉ comment chưa xóa)
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'comments',
                    pipeline: [
                        { $match: { parentComment: null, isDeleted: false } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'author',
                                foreignField: '_id',
                                as: 'author',
                                pipeline: [{ $project: { username: 1 } }],
                            },
                        },
                        { $unwind: '$author' },
                        { $project: { content: 1, author: '$author.username', createdAt: 1 } },
                    ],
                },
            },
            // Lookup trạng thái favorite của user
            {
                $lookup: {
                    from: 'favouritelists',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', userId ? new mongoose.Types.ObjectId(userId) : null] },
                                        { $in: ['$$postId', '$items.postId'] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'userFavorite',
                },
            },
            // Đếm comment (chỉ comment chưa xóa)
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'allComments',
                    pipeline: [{ $match: { isDeleted: false } }],
                },
            },
            {
                $project: {
                    title: 1,
                    content: { $substr: ['$content', 0, 200] },
                    author: {
                        id: '$author._id',
                        username: '$author.username',
                        avatar: { $ifNull: ['$author.avatar', 'default-avatar-url'] },
                    },
                    tags: 1,
                    imgUrl: 1,
                    commentCount: { $size: '$allComments' },
                    favoriteCount: 1,
                    reactions: 1, // Lấy trực tiếp từ PostSchema
                    postStatus: 1,
                    postType: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    commentPreview: { $arrayElemAt: ['$comments', 0] },
                    isLiked: { $gt: [{ $size: '$userFavorite' }, 0] },
                    ...(postType === 'Question' && { questionDetails: 1 }),
                    ...(postType === 'FindLostPetPost' && { lostPetInfo: 1 }),
                    ...(postType === 'EventPost' && { eventDate: 1 }),
                },
            },
        ];

        const [posts, totalPosts] = await Promise.all([
            PostModel.aggregate(postsPipeline).exec(),
            PostModel.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalPosts / limit);

        return {
            success: true,
            data: posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                limit,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    } catch (error) {
        console.error('Error in getListForumPosts:', {
            page,
            limit,
            tag,
            search,
            postType,
            sort,
            userId,
            error: error.message,
        });
        return { success: false, message: 'Lỗi server khi lấy danh sách bài viết' };
    }
};

/**
 * 📄 Lấy thông tin bài viết theo ID
 * @param {String} id - ID bài viết
 * @returns {Promise<Object>} - Kết quả lấy bài viết
 */
export const getPostById = async (id) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return { success: false, message: 'ID không hợp lệ' };
        }

        const post = await PostModel.findById(id)
            .populate('author', 'username avatar') // Thêm avatar cho chi tiết hơn
            .lean()
            .exec();

        if (!post) {
            return { success: false, message: 'Bài viết không tồn tại' };
        }

        // Chuẩn hóa dữ liệu author
        const formattedPost = {
            ...post,
            author: {
                id: post.author._id,
                username: post.author.username,
                avatar: post.author.avatar || 'default-avatar-url',
            },
        };

        return { success: true, data: formattedPost };
    } catch (error) {
        console.error('Error in getPostById:', {
            postId: id,
            error: error.message,
        });
        return { success: false, message: 'Lỗi server khi lấy bài viết' };
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
export const createPost = async (postType, postData) => {
    try {
        const PostSubModel = PostModel.discriminators[postType];

        if (!PostSubModel) {
            return { success: false, message: `Loại bài viết "${postType}" không hợp lệ.` };
        }

        const newPost = new PostSubModel(postData);
        await newPost.save();

        return { success: true, post: newPost };
    } catch (error) {
        console.error("❌ Lỗi khi tạo bài viết:", error);
        return { success: false, message: "Lỗi khi tạo bài viết", error };
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
        const post = await PostModel.findOneAndDelete(
            { _id: new mongoose.Types.ObjectId(postId), author: new mongoose.Types.ObjectId(userId) },
            { lean: true }
        ).exec();

        if (!post) {
            return { success: false, message: 'Không có quyền xóa hoặc bài viết không tồn tại' };
        }
        await Promise.all([
            CommentModel.deleteMany(
                { post: new mongoose.Types.ObjectId(postId) }
            ).exec(),
            Reaction.deleteMany(
                { targetType: 'Post', targetId: new mongoose.Types.ObjectId(postId) }
            ).exec(),
            FavouriteList.updateMany(
                { 'items.postId': new mongoose.Types.ObjectId(postId) },
                { $pull: { items: { postId: new mongoose.Types.ObjectId(postId) } } }
            ).exec(),
        ]);

        return { success: true, message: 'Xóa bài viết thành công!' };
    } catch (error) {
        console.error('Error in deletePost:', {
            postId,
            userId,
            error: error.message,
        });
        return { success: false, message: error.message || 'Lỗi server khi xóa bài viết' };
    }
};


/**
 * 📄 Lấy danh sách bài viết forum theo kiểu refreshed list
 * @param {Object} options - Tùy chọn
 * @param {Number} options.limit - Số bài mỗi lần tải (mặc định: 10)
 * @param {String} options.cursor - Giá trị score cuối cùng từ lần tải trước
 * @param {String} options.tag - Tag để lọc
 * @param {String} options.search - Từ khóa tìm kiếm
 * @param {String} options.postType - Loại bài viết
 * @param {Array} options.excludeIds - Danh sách ID bài cần loại trừ
 * @param {String} options.userId - ID người dùng (để lọc bài của họ)
 * @returns {Promise<Object>} - Danh sách bài viết và thông tin phân trang
 */

export const getRefreshedListForumPosts = async ({
    limit = 10,
    cursor = null,
    tag,
    search,
    postType,
    excludeIds = [],
    userId,
}) => {
    try {
        const filter = {
            $or: [
                { postStatus: 'public' },
                ...(userId ? [{ author: new mongoose.Types.ObjectId(userId) }] : []),
            ],
            ...(excludeIds.length > 0 && {
                _id: { $nin: excludeIds.map(id => new mongoose.Types.ObjectId(id)) },
            }),
        };

        if (tag) filter.tags = { $in: [tag] };
        if (search) filter.$text = { $search: search };
        if (postType) filter.postType = postType;
        if (cursor) filter.score = { $lt: parseFloat(cursor) };

        const postsPipeline = [
            { $match: filter },
            // Tính điểm ưu tiên (score)
            {
                $addFields: {
                    score: {
                        $add: [
                            { $multiply: [{ $toLong: '$createdAt' }, 0.00005] },
                            { $multiply: ['$commentCount', 5] },
                            { $multiply: ['$favoriteCount', 8] },
                            { $multiply: [{ $rand: {} }, 15] },
                        ],
                    },
                },
            },
            { $sort: { score: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                    pipeline: [{ $project: { username: 1, avatar: 1 } }],
                },
            },
            { $unwind: '$author' },
            // Lấy comment preview (chỉ comment chưa xóa)
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'comments',
                    pipeline: [
                        { $match: { parentComment: null, isDeleted: false } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'author',
                                foreignField: '_id',
                                as: 'author',
                                pipeline: [{ $project: { username: 1 } }],
                            },
                        },
                        { $unwind: '$author' },
                        { $project: { content: 1, author: '$author.username', createdAt: 1 } },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'favouritelists',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$user', userId ? new mongoose.Types.ObjectId(userId) : null] },
                                        { $in: ['$$postId', '$items.postId'] },
                                    ],
                                },
                            },
                        },
                    ],
                    as: 'userFavorite',
                },
            },
            // Đếm tổng comment (chỉ comment chưa xóa)
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: 'post',
                    as: 'allComments',
                    pipeline: [
                        { $match: { isDeleted: false } },
                    ],
                },
            },
            {
                $project: {
                    title: 1,
                    content: {
                        $cond: {
                            if: { $gte: [{ $strLenCP: "$content" }, 200] },
                            then: { $substrCP: ["$content", 0, 200] },
                            else: "$content"
                        }
                    },
                    author: {
                        id: '$author._id',
                        username: '$author.username',
                        avatar: { $ifNull: ['$author.avatar', 'default-avatar-url'] },
                    },
                    tags: 1,
                    imgUrl: 1,
                    commentCount: { $size: '$allComments' },
                    favoriteCount: 1,
                    reactions: 1,
                    postStatus: 1,
                    postType: 1,
                    createdAt: 1,
                    commentPreview: { $arrayElemAt: ['$comments', 0] },
                    isLiked: { $gt: [{ $size: '$userFavorite' }, 0] },
                    score: 1,
                    ...(postType === 'Question' && { questionDetails: 1 }),
                    ...(postType === 'FindLostPetPost' && { lostPetInfo: 1 }),
                    ...(postType === 'EventPost' && { eventDate: 1 }),
                },
            },
        ];

        const posts = await PostModel.aggregate(postsPipeline).exec();

        // Lấy cursor tiếp theo
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].score : null;

        return {
            success: true,
            data: posts,
            nextCursor,
            hasNext: posts.length === limit,
        };
    } catch (error) {
        console.error('Error in getRefreshedListForumPosts:', {
            limit,
            cursor,
            tag,
            search,
            postType,
            excludeIds,
            userId,
            error: error.message,
        });
        return { success: false, message: 'Lỗi server khi lấy danh sách bài ngẫu nhiên' };
    }
};


/**
 * 📄 Lấy danh sách bài viết mà user đã reaction hoặc comment
 * @param {Object} params - Tham số
 * @param {String} params.userId - ID người dùng
 * @param {Number} params.page - Trang hiện tại
 * @param {Number} params.limit - Số bài mỗi trang
 * @param {Boolean} [params.advancedFilter=false] - Bật bộ lọc nâng cao (nhóm theo postType)
 * @param {String} [params.sortBy='updatedAt'] - Sắp xếp theo 'createdAt' hoặc 'updatedAt'
 * @returns {Promise<Object>} - Danh sách bài viết và thông tin phân trang
 */


export const getUserInteractedPosts = async ({ userId, page, limit, advancedFilter = false, sortBy = 'updatedAt' }) => {
    try {
        const skip = (page - 1) * limit;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const reactedPostIds = await Reaction.distinct('targetId', {
            authReaction: userObjectId,
            targetType: 'Post',
        });
        const commentedPostIds = await CommentModel.distinct('post', {
            author: userObjectId,
            isDeleted: false,
        });
        const uniquePostIds = [...new Set([...reactedPostIds, ...commentedPostIds])]
            .map(id => new mongoose.Types.ObjectId(id));

        const totalPosts = uniquePostIds.length;
        const totalPages = Math.ceil(totalPosts / limit);

        const paginatedPostIds = uniquePostIds.slice(skip, skip + limit);

        const postsPipeline = [
            {
                $match: {
                    _id: { $in: paginatedPostIds },
                    isDeleted: false,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author',
                    pipeline: [{ $project: { username: 1, avatar: 1 } }],
                },
            },
            { $unwind: '$author' },
            {
                $lookup: {
                    from: 'reactions',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$authReaction', userObjectId] },
                                        { $eq: ['$targetType', 'Post'] },
                                        { $eq: ['$targetId', '$$postId'] },
                                    ],
                                },
                            },
                        },
                        { $project: { reactionType: 1, createdAt: 1 } },
                    ],
                    as: 'userReaction',
                },
            },
            {
                $lookup: {
                    from: 'comments',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$author', userObjectId] },
                                        { $eq: ['$post', '$$postId'] },
                                        { $eq: ['$isDeleted', false] },
                                    ],
                                },
                            },
                        },
                        ...(advancedFilter ? [
                            {
                                $lookup: {
                                    from: 'posts',
                                    localField: 'post',
                                    foreignField: '_id',
                                    as: 'postInfo',
                                },
                            },
                            { $unwind: '$postInfo' },
                        ] : []),
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 },
                        {
                            $project: {
                                content: 1,
                                createdAt: 1,
                                ...(advancedFilter ? { postType: '$postInfo.postType' } : {}),
                            },
                        },
                    ],
                    as: 'userComment',
                },
            },
            {
                $project: {
                    title: 1,
                    content: { $substrBytes: ['$content', 0, 200] },
                    author: {
                        id: '$author._id',
                        username: '$author.username',
                        avatar: { $ifNull: ['$author.avatar', 'default-avatar-url'] },
                    },
                    tags: 1,
                    imgUrl: 1,
                    commentCount: 1,
                    favoriteCount: 1,
                    reactions: 1,
                    postStatus: 1,
                    postType: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    userReaction: { $arrayElemAt: ['$userReaction', 0] },
                    userComment: { $arrayElemAt: ['$userComment', 0] },
                },
            },
            {
                $sort: {
                    ...(advancedFilter ? { postType: 1 } : {}),
                    [sortBy]: -1,
                },
            },
        ];

        const posts = await PostModel.aggregate(postsPipeline).exec();

        return {
            posts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                limit,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        };
    } catch (error) {
        console.error('Error in getUserInteractedPosts service:', {
            userId,
            page,
            limit,
            advancedFilter,
            sortBy,
            error: error.message,
        });
        throw error;
    }
};
