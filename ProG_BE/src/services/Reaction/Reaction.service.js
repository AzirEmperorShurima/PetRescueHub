import Reaction from "../../models/ReactionSchema";

/**
 * 📥 check loại post
 * @param {String} targetId - Id đối tượng
 * @param {String} rawTargetTypes - Loại post (Post, Comment, Question, ForumPost)
 * @returns {Promise<Object>} - Đối tượng chứa loại post và thông tin bài viết
 * @returns {null} - Nếu Không tìm thấy bài viết hoặc loại post không hợp lệ
 */
export const getTargetType = async (targetId, rawTargetTypes) => {
    const targetTypes = rawTargetTypes.toString().trim().toLowerCase()

    const validTypes = ["post", "comment", "question", "forumpost"];
    if (!validTypes.includes(targetTypes)) {
        throw new BadRequestError("Loại đối tượng không hợp lệ");
    }

    let target = await mongoose.model(targetTypes).findById(targetId);
    if (target) {
        return { targetType: targetTypes, target };
    }
    return null;
};

/**
 * 📥 Thêm hoặc cập nhật reaction cho bài viết hoặc comment
 * @param {String} userId - ID người dùng
 * @param {String} targetType - Loại đối tượng (Post hoặc Comment)
 * @param {String} targetId - ID đối tượng cần thả reaction
 * @param {String} reactionType - Loại reaction (like, love, haha, wow, sad, angry)
 * @returns {Promise<Object>}- Thông tin reaction đã tạo/cập nhật
 */

export const addOrUpdateReaction = async ({ userId, targetType, targetId, reactionType }) => {

    // if (!["Post", "Question", "ForumPost", "Comment"].includes(targetType)) {
    //     throw new BadRequestError("Loại đối tượng không hợp lệ");
    // }
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
        throw new BadRequestError("ID đối tượng không hợp lệ");
    }

    const Model = mongoose.model(targetType); // Sử dụng targetType động
    const target = await Model.findById(targetId);
    if (!target) {
        throw new NotFoundError(`${targetType} không tồn tại`);
    }

    const existed = await Reaction.findOne({ authReaction: userId, targetType, targetId });

    if (existed) {
        if (existed.reactionType === reactionType) {
            return { exist: true, status: "no change" };
        }

        // Nếu khác → xoá reaction cũ, thêm cái mới để middleware xử lý cập nhật count
        await existed.remove();
    }

    const newReaction = await Reaction.create({
        authReaction: userId,
        targetType,
        targetId,
        reactionType,
    });

    return { reaction: newReaction, status: "Success" };
};



/**
 * 📥 Thêm hoặc cập nhật reaction cho bài viết hoặc comment
 * @param {String} userId - ID người dùng
 * @param {String} targetId - ID đối tượng cần thả reaction
 * @param {String} reactionType - Loại reaction (like, love, haha, wow, sad, angry)
 * @returns {Promise<Object>} - Thông tin reaction đã tạo/cập nhật
 */

export const addOrUpdateCommentReaction = async ({ userId, targetId, reactionType }) => {

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
        throw new BadRequestError("ID đối tượng không hợp lệ");
    }

    const existed = await Reaction.findOne({ authReaction: userId, targetType: "Comment", targetId: commentId });
    if (existed) {
        if (existed.reactionType === reactionType) {
            return { exist: true, status: "no change" };
        }
        // Nếu có reaction khác, xoá và thêm mới
        await existed.remove();
    }

    const newReaction = await Reaction.create({
        authReaction: userId,
        targetType: "Comment",
        targetId: targetId,
        reactionType,
    });

    // Cập nhật số lượng reaction cho comment
    await CommentModel.findByIdAndUpdate(commentId, {
        $inc: { [`reactions.${reactionType}`]: 1 }
    });
    return newReaction;
};
/**
 * ❌ Gỡ reaction khỏi bài viết hoặc comment
 * @param {String} userId - ID người dùng
 * @param {String} targetType - Loại đối tượng (Post hoặc Comment)
 * @param {String} targetId - ID đối tượng
 * @returns {Promise<Object>} - Kết quả xóa reaction
 */
export const removeReaction = async ({ userId, targetId }) => {
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
        throw new BadRequestError("ID đối tượng không hợp lệ");
    }
    const existed = await Reaction.findOne({ authReaction: userId, targetType, targetId });

    if (!existed) {
        return { success: false, message: "Bạn chưa thả reaction nào" };
    }
    await existed.remove(); // Middleware tự cập nhật count 
    return { success: true, message: "Đã gỡ reaction thành công" };
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