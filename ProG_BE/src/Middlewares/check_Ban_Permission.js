import User from "../models/user.js";

export const checkBanStatus = async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (user.isBanned) {
        if (user.banUntil && new Date() < new Date(user.banUntil)) {
            return res.status(403).json({ message: `Tài khoản của bạn bị cấm đến ${user.banUntil}` });
        } else if (!user.banUntil) {
            return res.status(403).json({ message: "Tài khoản của bạn đã bị cấm vĩnh viễn!" });
        }
    }

    next();
};
