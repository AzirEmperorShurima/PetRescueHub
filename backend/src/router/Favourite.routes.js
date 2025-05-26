import { Router } from "express";
import { checkUserAuth } from "../Middlewares/userAuthChecker.js";
import {
    createFavoriteList,
    addItemToFavoriteList,
    removeItemFromFavoriteList,
    deleteFavoriteList,
    getAllFavoriteLists,
    getFavoriteListById,
    updateFavoriteListName
} from "../Controller/FavoriteList.Controller.js";
import { verifyAccessTokenMiddleware, verifyRefreshTokenMiddleware } from "../utils/auth/authUtils.js";

const favoriteListRoute = Router();

favoriteListRoute.use(checkUserAuth);

favoriteListRoute.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Chào mừng đến với API Danh sách yêu thích'
    });
});
favoriteListRoute.use(verifyAccessTokenMiddleware, verifyRefreshTokenMiddleware)
// Tạo danh sách yêu thích mới
favoriteListRoute.post('/favorites', createFavoriteList);

// Thêm item vào danh sách yêu thích
favoriteListRoute.post('/favorites/:listId/items', addItemToFavoriteList);

// Xóa item khỏi danh sách yêu thích
favoriteListRoute.delete('/favorites/:listId/items/:itemId', removeItemFromFavoriteList);

// Xóa toàn bộ danh sách yêu thích
favoriteListRoute.delete('/favorites/:listId', deleteFavoriteList);

// Lấy toàn bộ danh sách yêu thích của người dùng
favoriteListRoute.get('/favorites', getAllFavoriteLists);

// Lấy chi tiết một danh sách yêu thích
favoriteListRoute.get('/favorites/:listId', getFavoriteListById);

// Cập nhật tên danh sách yêu thích
favoriteListRoute.put('/favorites/:listId/name', updateFavoriteListName);

export default favoriteListRoute;