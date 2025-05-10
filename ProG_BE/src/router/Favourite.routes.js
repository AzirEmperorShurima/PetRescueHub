import { Router } from "express";
import { checkUserAuth } from "../Middlewares/userAuthChecker.js";
import {
    createFavoriteList,
    addItemToFavoriteList,
    removeItemFromFavoriteList,
    deleteFavoriteList
} from "../Controller/FavoriteList.Controller.js";

const favoriteListRoute = Router();


favoriteListRoute.post(
    '/v1/favorite-lists',
    checkUserAuth,
    createFavoriteList
);


favoriteListRoute.post(
    '/v1/favorite-lists/:listId/items',
    checkUserAuth,
    addItemToFavoriteList
);


favoriteListRoute.delete(
    '/v1/favorite-lists/:listId/items/:itemId',
    checkUserAuth,
    removeItemFromFavoriteList
);


favoriteListRoute.delete(
    '/v1/favorite-lists/:listId',
    checkUserAuth,
    deleteFavoriteList
);

export default favoriteListRoute;