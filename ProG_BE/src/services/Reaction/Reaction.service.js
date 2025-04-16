import mongoose from "mongoose";
import Reaction from "../../models/ReactionSchema.js";
import { PostModel } from "../../models/PostSchema.js";

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
 * Thêm hoặc cập nhật reaction cho bài viết hoặc comment
 * @param {Object} params - Thông tin reaction
 * @param {String} params.userId - ID người dùng
 * @param {String} params.targetType - Loại đối tượng (Post, Comment, hoặc các discriminator)
 * @param {String} params.targetId - ID đối tượng cần thả reaction
 * @param {String} params.reactionType - Loại reaction (like, love, haha, wow, sad, angry)
 * @returns {Promise<Object>} - Thông tin reaction đã tạo/cập nhật
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
        const target = await Model.findById(targetId)
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
        })

        let reaction;
        if (existingReaction) {
            if (existingReaction.reactionType === reactionType) {
                return { success: true, isNew: false, reaction: existingReaction, message: 'Reaction không thay đổi' };
            }
        }
        reaction = await Reaction.create(
            [{
                authReaction: new mongoose.Types.ObjectId(userId),
                targetType,
                targetId,
                reactionType,
            }]
        );

        return { success: true, isNew: !existingReaction, reaction: reaction[0], message: 'Reaction đã được xử lý' };
    } catch (error) {
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
            return { success: false, message: "Không có reaction nào", summary: null };
        }
        const summary = reactions.reduce((acc, curr) => {
            acc[curr.reactionType] = (acc[curr.reactionType] || 0) + 1;
            return acc;
        }, {});

        return summary;
    }
    catch (error) {
        console.error("Lỗi khi lấy danh sách reaction:", error);
        return { success: false, message: "Lỗi server khi lấy danh sách reaction", err: error };
    }

};