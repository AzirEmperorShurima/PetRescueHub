import ForumPost from "../../models/ForumPost";

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
export const getListForumPosts = async ({ page = 1, limit = 10, tag, search, postType, sort }) => {
    try {
        const filter = {};
        if (tag) filter.tags = tag;
        if (search) filter.$text = { $search: search }; // Sử dụng index text để tìm kiếm tối ưu hơn
        if (postType) filter.postType = postType; // Lọc theo loại bài viết nếu có

        const posts = await PostModel.find(filter)
            .populate("author", "username")
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .lean();

        return { success: true, data: posts };
    } catch (error) {
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

        const newPost = new PostModel({
            title: title.trim(),
            content: content.trim(),
            author: userId,
            tags: tags || [],
            imgUrl: imgUrl || [],
            postType,
            postStatus: "open",
        });

        await newPost.save();
        return { success: true, message: "Đăng bài thành công!", post: newPost };
    } catch (error) {
        return { success: false, message: "Lỗi server khi đăng bài", error };
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
        // Chỉ lấy các trường hợp lệ
        // const allowedFields = ["title", "content", "tags", "imgUrl", "postStatus"];
        // const updateFields = Object.keys(updateData).reduce((acc, key) => {
        //     if (allowedFields.includes(key)) {
        //         acc[key] = typeof updateData[key] === "string" ? updateData[key].trim() : updateData[key];
        //     }
        //     return acc;
        // }, {});

        if (Object.keys(updateData).length === 0) {
            return { success: false, message: "Không có dữ liệu hợp lệ để cập nhật" };
        }

        const post = await PostModel.findOneAndUpdate(
            { _id: postId, author: userId },
            updateFields,
            { new: true, runValidators: true }
        );

        if (!post) {
            return { success: false, message: "Không có quyền cập nhật hoặc bài viết không tồn tại" };
        }
        return { success: true, message: "Cập nhật thành công", post };
    } catch (error) {
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
        // Tìm bài viết trước khi xóa
        const post = await PostModel.findOne({ _id: postId, author: userId });

        if (!post) {
            return { success: false, message: "Không có quyền xóa hoặc bài viết không tồn tại" };
        }

        // Xóa tất cả bình luận liên quan đến bài viết
        await Comment.deleteMany({ postId });

        // Xóa tất cả reactions liên quan đến bài viết
        await Reaction.deleteMany({ targetId: postId });

        // Xóa bài viết khỏi danh sách yêu thích
        await FavouriteList.updateMany(
            { "items.postId": postId },
            { $pull: { items: { postId } } }
        );

        // Xóa bài viết
        await PostModel.findByIdAndDelete(postId);

        return { success: true, message: "Xóa bài viết thành công!" };
    } catch (error) {
        return { success: false, message: "Lỗi server khi xóa bài viết", error };
    }
};
