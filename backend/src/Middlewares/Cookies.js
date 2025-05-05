import jwt from "jsonwebtoken"
import { SECRET_KEY } from "../../config.js"
import { StatusCodes } from "http-status-codes";

export const getCookies = async ({
    PayLoad,
    path = '/',
    cookieName = 'Anonymous',
    maxAge = 1000 * 60 * 60 * 24, // default 24h
    expiresIn = '24h',
    res
}) => {
    try {
        if (!res || typeof res.cookie !== 'function') {
            throw new Error('Invalid "res" object provided to getCookies');
        }

        if (!PayLoad || typeof PayLoad !== 'object') {
            throw new Error('"PayLoad" must be a valid object');
        }

        if (!cookieName || typeof cookieName !== 'string') {
            throw new Error('"cookieName" must be a valid string');
        }

        if (!expiresIn || (typeof expiresIn !== 'string' && typeof expiresIn !== 'number')) {
            throw new Error('"expiresIn" must be a string (like "24h", "15m") or number of seconds');
        }

        const token = jwt.sign(PayLoad, SECRET_KEY, { expiresIn });

        res.cookie(cookieName, token, {
            maxAge,
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path,
        });

        return token;
    } catch (err) {
        console.error('Create Cookies Error:', err);
        throw new Error('Failed to create cookies: ' + err.message);
    }
};

// export const getCookies = async ({ PayLoad, path = '/', cookieName = 'Anonymous', maxAge, expiresIn = '24h', res }) => {
//     try {
//         const token = jwt.sign(PayLoad, SECRET_KEY, { expiresIn });

//         res.cookie(cookieName, token, {
//             maxAge: maxAge || 1000 * 60 * 60 * 24,
//             httpOnly: true,
//             secure: true,
//             sameSite: 'Strict',
//             path: path,
//         });

//         return token
//     } catch (err) {
//         console.error("Create Cookies Error:", err);
//         throw new Error("Failed to create cookies");
//     }
// };



export const verifyCookies = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user;
        next();
    } catch (err) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden', error: err.message });
    }
};


export const logoutCookies = async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await user.findById(decoded.id);

        if (user) {
            user.tokens = user.tokens.filter(storedToken => storedToken.token !== token);
            await user.save();
        }

        res.clearCookie('token'); // Xóa cookie
        return res.status(StatusCodes.OK).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Logout failed", error: err.message });
    }
};
