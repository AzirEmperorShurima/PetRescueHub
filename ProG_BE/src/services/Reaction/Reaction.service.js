import mongoose from "mongoose";
import Reaction from "../../models/ReactionSchema.js";
import { PostModel } from "../../models/PostSchema.js";
import { BadRequestError, NotFoundError } from "../../utils/ApiError.js";

/**
 * 📥 Thêm hoặc cập nhật reaction cho bài viết hoặc comment
 * @param {String} userId - ID người dùng
 * @param {String} targetType - Loại đối tượng (Post hoặc Comment)
 * @param {String} targetId - ID đối tượng cần thả reaction
 * @param {String} reactionType - Loại reaction (like, love, haha, wow, sad, angry)
 * @returns {Promise<Object>}- Thông tin reaction đã tạo/cập nhật
 */
export const modelsMap = {
    Post: PostModel,
    Comment: mongoose.model('Comment'),
    ...PostModel.discriminators,
};

/**
 * Thêm, cập nhật hoặc xóa reaction cho bài viết hoặc comment
 * @param {Object} params - Thông tin reaction
 * @param {String} params.userId - ID người dùng
 * @param {String} params.targetType - Loại đối tượng (Post, Comment, hoặc các discriminator)
 * @param {String} params.targetId - ID đối tượng cần thả reaction
 * @param {String} params.reactionType - Loại reaction (like, love, haha, wow, sad, angry)
 * @returns {Promise<Object>} - Thông tin reaction đã tạo/cập nhật/xóa
 */
export const addOrUpdateReaction = async ({ userId, targetType, targetId, reactionType }) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(targetId) || !mongoose.Types.ObjectId.isValid(userId)) {
            throw new BadRequestError('ID người dùng hoặc target không hợp lệ');
        }

        const validTargetTypes = Object.keys(modelsMap);
        if (!validTargetTypes.includes(targetType)) {
            throw new BadRequestError(`Target type không hợp lệ, phải là một trong: ${validTargetTypes.join(', ')}`);
        }

        const validReactionTypes = Reaction.schema.paths.reactionType.enumValues;
        if (!validReactionTypes.includes(reactionType)) {
            throw new BadRequestError(`Loại reaction không hợp lệ, phải là một trong: ${validReactionTypes.join(', ')}`);
        }

        const Model = modelsMap[targetType];
        const target = await Model.findById(targetId);
        if (!target) {
            throw new NotFoundError(`${targetType} không tồn tại`);
        }

        if (target.isDeleted) {
            throw new BadRequestError(`${targetType} đã bị xóa, không thể thêm reaction`);
        }

        const existingReaction = await Reaction.findOne({
            authReaction: new mongoose.Types.ObjectId(userId),
            targetType,
            targetId,
        });

        // Nếu đã có reaction và loại reaction giống nhau -> xóa reaction (hủy reaction)
        if (existingReaction && existingReaction.reactionType === reactionType) {
            await Reaction.deleteOne({ _id: existingReaction._id });
            return {
                success: true,
                action: 'removed',
                message: 'Đã hủy reaction',
                reactionType: reactionType
            };
        }

        // Nếu đã có reaction nhưng loại reaction khác -> cập nhật loại reaction
        if (existingReaction) {
            const oldReactionType = existingReaction.reactionType;
            const updatedReaction = await Reaction.findOneAndUpdate(
                { _id: existingReaction._id },
                { $set: { reactionType: reactionType } },
                { new: true }
            );

            return {
                success: true,
                action: 'updated',
                reaction: updatedReaction,
                oldReactionType,
                message: 'Đã cập nhật loại reaction'
            };
        }

        // Nếu chưa có reaction -> tạo mới
        const newReaction = await Reaction.create({
            authReaction: new mongoose.Types.ObjectId(userId),
            targetType,
            targetId,
            reactionType,
        });

        return {
            success: true,
            action: 'created',
            reaction: newReaction,
            message: 'Đã thêm reaction mới'
        };
    } catch (error) {
        console.error('Error in addOrUpdateReaction:', error);
        throw error;
    }
};

/**
 * 📊 Lấy danh sách reaction theo bài viết hoặc comment
 * @param {String} targetType - Loại đối tượng (Post hoặc Comment)
 * @param {String} targetId - ID đối tượng
 * @returns {Promise<Object>} - Tổng hợp số lượng mỗi loại reaction
 */
export const getReactionsService = async ({ targetType, targetId }) => {
    try {
        const reactions = await Reaction.find({ targetType, targetId });
        if (!reactions || reactions.length === 0) {
            return { success: false, message: "Không có reaction nào", summary: {} };
        }

        const summary = reactions.reduce((acc, curr) => {
            acc[curr.reactionType] = (acc[curr.reactionType] || 0) + 1;
            return acc;
        }, {});

        return { success: true, summary, count: reactions.length };
    } catch (error) {
        console.error("Lỗi khi lấy danh sách reaction:", error);
        return { success: false, message: "Lỗi server khi lấy danh sách reaction", error: error.message };
    }
};

/**
 * 🔍 Kiểm tra reaction của người dùng cho một đối tượng
 * @param {String} userId - ID người dùng
 * @param {String} targetType - Loại đối tượng (Post hoặc Comment)
 * @param {String} targetId - ID đối tượng
 * @returns {Promise<Object>} - Thông tin reaction của người dùng
 */
export const getUserReactionService = async ({ userId, targetType, targetId }) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(targetId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return { success: false, message: 'ID người dùng hoặc target không hợp lệ' };
        }

        if (!modelsMap[targetType]) {
            return { success: false, message: 'Loại đối tượng không hợp lệ' };
        }

        const reaction = await Reaction.findOne({
            authReaction: new mongoose.Types.ObjectId(String(userId)),
            targetType,
            targetId,
        });

        if (!reaction) {
            return { success: false, message: 'Người dùng chưa reaction', hasReacted: false };
        }

        return {
            success: true,
            hasReacted: true,
            reactionType: reaction.reactionType,
            reaction
        };
    } catch (error) {
        console.error("Lỗi khi kiểm tra reaction của người dùng:", error);
        return { success: false, message: "Lỗi server khi kiểm tra reaction", error: error.message };
    }
};

/**
 * 📄 Lấy danh sách bài viết mà user đã reaction hoặc comment
 * @param {Object} params - Thông tin truy vấn
 * @param {String} params.userId - ID người dùng
 * @param {Number} params.page - Số trang
 * @param {Number} params.limit - Số lượng bài viết mỗi trang
 * @returns {Promise<Object>} - Danh sách bài viết và thông tin phân trang
 */
export const getUserInteractedPosts = async ({ userId, page = 1, limit = 10 }) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return { success: false, message: 'ID người dùng không hợp lệ' };
        }

        const skip = (page - 1) * limit;

        // Lấy ID các bài viết mà người dùng đã reaction
        const reactedPostIds = await Reaction.find({
            authReaction: new mongoose.Types.ObjectId(userId),
            targetType: 'Post'
        }).distinct('targetId');

        // Lấy ID các bài viết mà người dùng đã comment
        const commentedPostIds = await mongoose.model('Comment').find({
            author: new mongoose.Types.ObjectId(userId)
        }).distinct('post');

        // Kết hợp và loại bỏ trùng lặp
        const interactedPostIds = [...new Set([...reactedPostIds, ...commentedPostIds])];

        const totalPosts = interactedPostIds.length;

        // Lấy thông tin chi tiết của các bài viết
        const posts = await PostModel.find({
            _id: { $in: interactedPostIds }
        })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'username avatar');

        return {
            success: true,
            posts,
            pagination: {
                totalPosts,
                currentPage: page,
                totalPages: Math.ceil(totalPosts / limit),
                limit
            }
        };
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bài viết đã tương tác:", error);
        return { success: false, message: "Lỗi server khi lấy danh sách bài viết", error: error.message };
    }
};