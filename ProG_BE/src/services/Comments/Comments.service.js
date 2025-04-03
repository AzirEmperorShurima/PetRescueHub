/**
 * 📥 Thêm comment vào bài viết
 * @param {String} postId - ID bài viết
 * @param {String} content - Nội dung comment
 * @param {String} parentComment - ID comment cha (nếu có)
 * @param {String} userId - ID người dùng gửi comment
 * @returns {Promise<Object>} - Kết quả tạo comment
 */

export const addCommentService = async (postId, content, parentComment, userId) => {
    try {
        // Kiểm tra bài viết có tồn tại không
        const post = await ForumPost.findById(postId);
        if (!post) {
            return { success: false, message: "Bài viết không tồn tại" };
        }

        // Tính toán độ sâu của comment (0 nếu không có parent, 1 nếu có parent)
        const depth = parentComment ? 1 : 0;

        // Tạo comment mới
        const newComment = new Comment({
            content,
            author: userId,
            postId,
            postType: "ForumPost",
            parentComment,
            depth
        });

        // Lưu vào cơ sở dữ liệu
        await newComment.save();

        // Trả về kết quả thành công
        return { success: true, comment: newComment };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Lỗi server khi tạo comment", error };
    }
};