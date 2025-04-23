import { getUserIdFromCookies } from "../services/User/User.service";

export const authMiddleware = (req, res, next) => {
    if (!getUserIdFromCookies(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    next();
};
