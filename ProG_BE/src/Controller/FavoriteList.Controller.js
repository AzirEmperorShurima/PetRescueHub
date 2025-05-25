import { StatusCodes } from "http-status-codes";
import FavouriteList from "../models/FavouriteList.js";

// Tạo danh sách yêu thích mới
export const createFavoriteList = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id; // Lấy từ middleware auth

        if (!name) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Tên danh sách không được để trống"
            });
        }

        const newList = new FavouriteList({
            name,
            user: userId,
            items: []
        });

        await newList.save();

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Tạo danh sách yêu thích thành công",
            list: newList
        });
    } catch (error) {
        console.error("Lỗi khi tạo danh sách yêu thích:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã xảy ra lỗi khi tạo danh sách yêu thích"
        });
    }
};

// Thêm bài viết vào danh sách yêu thích
export const addItemToFavoriteList = async (req, res) => {
    try {
        const { listId } = req.params;
        const { postId, postType, importantLevel } = req.body;
        const userId = req.user._id;

        const list = await FavouriteList.findOne({ _id: listId, user: userId });
        if (!list) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Không tìm thấy danh sách yêu thích"
            });
        }

        // Kiểm tra xem bài viết đã tồn tại trong danh sách chưa
        const existingItem = list.items.find(item =>
            item.postId.toString() === postId && item.postType === postType
        );

        if (existingItem) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Bài viết đã tồn tại trong danh sách"
            });
        }

        list.items.push({
            postId,
            postType,
            importantLevel: importantLevel || 3
        });

        await list.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Thêm bài viết vào danh sách yêu thích thành công",
            list
        });
    } catch (error) {
        console.error("Lỗi khi thêm bài viết vào danh sách:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã xảy ra lỗi khi thêm bài viết"
        });
    }
};

// Xóa bài viết khỏi danh sách yêu thích
export const removeItemFromFavoriteList = async (req, res) => {
    try {
        const { listId, itemId } = req.params;
        const userId = req.user._id;

        const list = await FavouriteList.findOne({ _id: listId, user: userId });
        if (!list) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Không tìm thấy danh sách yêu thích"
            });
        }

        const itemIndex = list.items.findIndex(item => item._id.toString() === itemId);
        if (itemIndex === -1) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Không tìm thấy bài viết trong danh sách"
            });
        }

        list.items.splice(itemIndex, 1);
        await list.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Xóa bài viết khỏi danh sách thành công",
            list
        });
    } catch (error) {
        console.error("Lỗi khi xóa bài viết khỏi danh sách:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã xảy ra lỗi khi xóa bài viết"
        });
    }
};

// Xóa toàn bộ danh sách yêu thích
export const deleteFavoriteList = async (req, res) => {
    try {
        const { listId } = req.params;
        const userId = req.user._id;

        const list = await FavouriteList.findOne({ _id: listId, user: userId });
        if (!list) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Không tìm thấy danh sách yêu thích"
            });
        }

        await list.remove(); // Sử dụng remove() để trigger middleware pre remove

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Xóa danh sách yêu thích thành công"
        });
    } catch (error) {
        console.error("Lỗi khi xóa danh sách yêu thích:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã xảy ra lỗi khi xóa danh sách"
        });
    }
};


// Cập nhật tên danh sách yêu thích
export const updateFavoriteListName = async (req, res) => {
    try {
        const { listId } = req.params;
        const { name } = req.body;
        const userId = req.user._id;

        if (!name || name.trim().length === 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Tên danh sách không được để trống"
            });
        }

        const list = await FavouriteList.findOne({ _id: listId, user: userId });
        if (!list) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Không tìm thấy danh sách yêu thích"
            });
        }

        list.name = name.trim();
        await list.save();

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Cập nhật tên danh sách thành công",
            list
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật tên danh sách:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã xảy ra lỗi khi cập nhật tên danh sách"
        });
    }
};

// Xóa toàn bộ danh sách yêu thích
// export const deleteFavoriteList = async (req, res) => {
//     try {
//         const { listId } = req.params;
//         const userId = req.user._id;

//         const list = await FavouriteList.findOne({ _id: listId, user: userId });
//         if (!list) {
//             return res.status(StatusCodes.NOT_FOUND).json({
//                 success: false,
//                 message: "Không tìm thấy danh sách yêu thích"
//             });
//         }

//         await list.remove(); // Sử dụng remove() để trigger middleware pre remove

//         return res.status(StatusCodes.OK).json({
//             success: true,
//             message: "Xóa danh sách yêu thích thành công"
//         });
//     } catch (error) {
//         console.error("Lỗi khi xóa danh sách yêu thích:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Đã xảy ra lỗi khi xóa danh sách"
//         });
//     }
// };

// Lấy toàn bộ danh sách yêu thích của người dùng
export const getAllFavoriteLists = async (req, res) => {
    try {
        const userId = req.user._id;

        const lists = await FavouriteList.find({ user: userId })
            .populate({
                path: 'items.postId',
                select: 'title content author createdAt'
            })
            .sort({ createdAt: -1 });

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Lấy danh sách yêu thích thành công",
            lists
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã xảy ra lỗi khi lấy danh sách yêu thích"
        });
    }
};

// Lấy chi tiết một danh sách yêu thích
export const getFavoriteListById = async (req, res) => {
    try {
        const { listId } = req.params;
        const userId = req.user._id;

        const list = await FavouriteList.findOne({ _id: listId, user: userId })
            .populate({
                path: 'items.postId',
                select: 'title content author createdAt'
            });

        if (!list) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Không tìm thấy danh sách yêu thích"
            });
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Lấy thông tin danh sách yêu thích thành công",
            list
        });
    } catch (error) {
        console.error("Lỗi khi lấy thông tin danh sách yêu thích:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã xảy ra lỗi khi lấy thông tin danh sách yêu thích"
        });
    }
};