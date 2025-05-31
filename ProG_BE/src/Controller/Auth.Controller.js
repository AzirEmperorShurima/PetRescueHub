import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { COOKIE_PATHS, SECRET_KEY, TOKEN_TYPE } from '../../config.js';
import user from '../models/user.js';
import { getCookies } from '../Middlewares/Cookies.js';
import Role from '../models/Role.js';
import Notification from '../models/NotificationSchema.js'
import { _encrypt } from '../utils/_crypto_.js';
import { otpGenerator } from '../services/Otp/createOTP.js';
import { sendMailForgotPassword, sendMailNotification, sendMailService } from '../services/sendMailService/nodeMailer.service.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { getUserFieldFromToken } from '../services/User/User.service.js';
import mongoose from 'mongoose';
import { redisClient } from '../Config/redis.client.js';
import { buildGreeting } from '../utils/buildGreeting.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export const Signup_Handler = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const role = await Role.findOne({ name: 'user' });
        if (!role) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Role 'user' not found" });
        }

        const CreateUser = new user({ username, password, email, roles: [role._id] });
        const userSignUpPayLoad = {
            id: CreateUser._id,
            tokenType: TOKEN_TYPE.REGISTER_VERIFY.name,
        }
        const token = await getCookies({
            PayLoad: userSignUpPayLoad,
            path: COOKIE_PATHS.REGISTER_VERIFY.Path,
            cookieName: COOKIE_PATHS.REGISTER_VERIFY.CookieName,
            maxAge: TOKEN_TYPE.REGISTER_VERIFY.maxAge,
            expiresIn: TOKEN_TYPE.REGISTER_VERIFY.expiresIn,
            res
        });
        const register_token_redisKey = `register:${CreateUser._id}`;
        await redisClient.set(register_token_redisKey, token, { EX: 60 * 15 });

        // ✅ Trả phản hồi ngay lập tức (không chờ email gửi xong)
        res.status(StatusCodes.CREATED).json({
            message: "User registered successfully. Please verify the OTP sent to your email.",
            user: {
                id: CreateUser._id,
                username: CreateUser.username,
                email: CreateUser.email,
                createdAt: dayjs().tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY HH:mm:ss (UTC+7)"),
                updatedAt: dayjs().tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY HH:mm:ss (UTC+7)"),
                isActive: false,
                emailVerified: CreateUser.isActive,
                roles: ["user"]
            }
        });

        // ✅
        const generateOTP = otpGenerator();
        const redisKey = `otp:signup:${CreateUser._id}`;

        Promise.all([
            CreateUser.save(),
            RedisClient.set(redisKey, generateOTP, { EX: 60 * 15 })
        ]).then(() => {
            // ✅ Gửi email OTP sau khi phản hồi API
            setImmediate(() => {
                sendMailService({ email, username, otp: generateOTP })
                    .catch(err => console.error("Send mail failed:", err));
            });
        }).catch(err => console.error("Error in background tasks:", err));

    } catch (error) {
        console.error("Error in Create User Task:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error in Create User Task',
            error: { message: error.message || "An unknown error occurred", details: error.errors || {} }
        });
    }
};

export const loginHandler = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!(username || email) || !password) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Username/Email and Password are required",
            });
        }

        // Tìm user theo email hoặc username
        const foundUser = await user
            .findOne(email ? { email } : { username })
            .populate("roles", "name");

        if (!foundUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid credentials" });
        }

        if (!foundUser.isActive) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "User is not active" });
        }

        // So sánh mật khẩu
        const isPasswordValid = await user.comparePassword(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid Password" });
        }

        // Tạo payload
        const userLoginPayLoad = {
            id: foundUser._id,
            email: foundUser.email,
            roles: foundUser.roles.map(r => r.name),
            tokenType: TOKEN_TYPE.ACCESS_TOKEN.name,
        };

        const refreshTokenPayload = {
            id: foundUser._id,
            email: foundUser.email,
            tokenType: TOKEN_TYPE.REFRESH_TOKEN.name,
        };

        const [accessCookie, refreshCookie] = await Promise.all([
            getCookies({
                PayLoad: userLoginPayLoad,
                path: COOKIE_PATHS.ACCESS_TOKEN.Path,
                cookieName: COOKIE_PATHS.ACCESS_TOKEN.CookieName,
                maxAge: TOKEN_TYPE.ACCESS_TOKEN.maxAge,
                expiresIn: TOKEN_TYPE.ACCESS_TOKEN.expiresIn,
                res
            }),
            getCookies({
                PayLoad: refreshTokenPayload,
                path: COOKIE_PATHS.REFRESH_TOKEN.Path,
                cookieName: COOKIE_PATHS.REFRESH_TOKEN.CookieName,
                maxAge: TOKEN_TYPE.REFRESH_TOKEN.maxAge,
                expiresIn: TOKEN_TYPE.REFRESH_TOKEN.expiresIn,
                res
            }),
        ]);

        // Trả response sớm
        res.status(StatusCodes.OK).json({
            message: "User login successful",
            user: {
                id: foundUser._id,
                username: foundUser.username,
                gender: foundUser.gender,
                phonenumber: foundUser.phonenumber,
                address: foundUser.address,
                avatar: foundUser.avatar,
                email: foundUser.email,
                roles: foundUser.roles.map(r => r.name),
            }
        });

        setImmediate(async () => {
            try {
                const { greetingTitle, greetingMessage, priority, metadata } = buildGreeting(foundUser);
                const notification = new Notification({
                    userId: foundUser._id.toString(),
                    type: 'success',
                    title: greetingTitle,
                    message: greetingMessage,
                    priority,
                    relatedTo: 'login',
                    metadata,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
                });

                foundUser.lastLoginAt = new Date();

                await Promise.all([
                    notification.save(),
                    foundUser.save()
                ]);
                manageTokens(foundUser, accessCookie, TOKEN_TYPE.ACCESS_TOKEN.name)
            } catch (e) {
                console.warn("Background login processing error:", e.message);
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};


export const logoutHandler = async (req, res) => {
    const token = req.cookies[COOKIE_PATHS.ACCESS_TOKEN.CookieName];

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Missing access token. Unauthorized access.",
        });
    }

    const { tokenType: accessTokenType, _id: userId } = req.user || {};
    const { tokenType: refreshTokenType } = req.refreshUser || {};

    const isInvalidTokenType =
        accessTokenType !== TOKEN_TYPE.ACCESS_TOKEN.name ||
        refreshTokenType !== TOKEN_TYPE.REFRESH_TOKEN.name;

    if (isInvalidTokenType) {
        return res.status(StatusCodes.FORBIDDEN).json({
            message: "Invalid token types. 🚫 Access Denied",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Invalid user ID. Unauthorized access.",
        });
    }

    res.clearCookie(TOKEN_TYPE.ACCESS_TOKEN.name);
    res.clearCookie(TOKEN_TYPE.REFRESH_TOKEN.name);

    res.status(StatusCodes.OK).json({
        message: "Logout request received. Processing in background.",
    });

    user.updateOne(
        { _id: userId },
        { $pull: { tokens: { token } } }
    ).catch(err => {
        console.error("Background logout error:", err.message);
    });
};

export const refreshToken = async (req, res) => {
    try {

        const refreshToken = req.cookies[COOKIE_PATHS.REFRESH_TOKEN.CookieName];
        if (!refreshToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Missing refresh token' });
        }

        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid or missing access token' });
        }


        const founduser = await user.findById(userId);
        if (!founduser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'User not found' });
        }
        const matchedToken = founduser.tokens.find(
            (tokenObj) => tokenObj.token === refreshToken && tokenObj.type === TOKEN_TYPE.REFRESH_TOKEN.name
        );
        if (!matchedToken) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: 'Invalid or revoked refresh token' });
        }

        // Xóa refresh token cũ
        founduser.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== refreshToken);

        const refreshTokenPayload = {
            id: founduser._id,
            email: founduser.email,
            tokenType: TOKEN_TYPE.REFRESH_TOKEN.name,
        };
        const accessTokenPayload = {
            id: founduser._id,
            email: founduser.email,
            roles: founduser.roles.map((role) => role.name),
            tokenType: TOKEN_TYPE.ACCESS_TOKEN.name,
        };

        // Tạo tokens mới và lưu vào cookie
        const newRefreshToken = await getCookies({
            PayLoad: refreshTokenPayload,
            path: COOKIE_PATHS.REFRESH_TOKEN.Path,
            cookieName: COOKIE_PATHS.REFRESH_TOKEN.CookieName,
            maxAge: TOKEN_TYPE.REFRESH_TOKEN.maxAge,
            expiresIn: TOKEN_TYPE.REFRESH_TOKEN.expiresIn,
            res
        });
        const newAccessToken = await getCookies({
            PayLoad: accessTokenPayload,
            path: COOKIE_PATHS.ACCESS_TOKEN.Path,
            cookieName: COOKIE_PATHS.ACCESS_TOKEN.CookieName,
            maxAge: TOKEN_TYPE.ACCESS_TOKEN.maxAge,
            expiresIn: TOKEN_TYPE.ACCESS_TOKEN.expiresIn,
            res
        });

        founduser.tokens.push(
            {
                type: TOKEN_TYPE.REFRESH_TOKEN.name,
                token: newRefreshToken,
                signedAt: Date.now(),
                expiredAt: Date.now() + TOKEN_TYPE.REFRESH_TOKEN.maxAge,
            },
            {
                type: TOKEN_TYPE.ACCESS_TOKEN.name,
                token: newAccessToken,
                signedAt: Date.now(),
                expiredAt: Date.now() + TOKEN_TYPE.ACCESS_TOKEN.maxAge,
            }
        );
        await founduser.save();

        return res.status(StatusCodes.OK).json({ message: 'Token refreshed successfully' });
    } catch (error) {
        console.error('Refresh token error:', error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ error: 'Internal server error', details: error.message });
    }
};

export const manageTokens = async (_user, token, type) => {
    try {
        const now = Date.now();
        if (!_user.tokens) {
            _user.tokens = [];
        }
        _user.tokens = _user.tokens.filter(tokenObj => (now - tokenObj.signedAt) < 86400000);
        if (_user.tokens.length >= 5) {
            _user.tokens.shift();
        }
        _user.tokens.push({
            type,
            token,
            signedAt: now,
            expiredAt: now + 86400000
        });
        await _user.save();
        return token;
    } catch (error) {
        console.error("Error managing tokens:", error);
        throw new Error("Unable to manage tokens");
    }
};


export const getProfile = async (req, res) => {
    try {
        const userToken = req.cookies[COOKIE_PATHS.ACCESS_TOKEN.CookieName]
        if (!userToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - No token provided" });
        }
        const currUserId = req.user._id.toString()
        const currUserRoles = req.user.roles
        const currAccessTokenType = req.user.tokenType
        const rawTarget = req.params.targetUser || currUserId;
        const targetUser = typeof rawTarget === 'string' ? rawTarget.trim() : rawTarget.toString();

        if (!currUserId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - No token provided" });
        }

        if (!currAccessTokenType || currAccessTokenType !== TOKEN_TYPE.ACCESS_TOKEN.name) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Access Denied - Invalid token type" });
        }


        let foundUser;
        if (mongoose.isValidObjectId(targetUser)) {
            foundUser = await user.findOne({ _id: targetUser }).populate("roles", "name").lean();
        } else {
            foundUser = await user.findOne({ username: targetUser }).populate("roles", "name").lean();
        }

        if (!foundUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }
        const isAdmin = currUserRoles.includes('admin')
        const isOwner = foundUser._id.toString() === currUserId;
        const isPrivate = foundUser.isPrivate || false;

        // Nếu là chủ tài khoản thì kiểm tra token có tồn tại trong DB không
        if (isOwner) {
            const currentToken = req.cookies[TOKEN_TYPE.ACCESS_TOKEN.name];
            if (Array.isArray(foundUser.tokens) && foundUser.tokens.length > 0) {
                const isTokenValid = foundUser.tokens.some(tokenObj => tokenObj.token === currentToken);
                if (!isTokenValid) {
                    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - Token mismatch" });
                }
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - Token not found" });
            }
        }

        let userProfile = {
            id: foundUser._id.toString(),
            username: foundUser.username,
            fullName: foundUser.fullname,
            birthdate: foundUser.birthdate,
            biography: foundUser.biography,
            avatar: foundUser.avatar,
            address: isPrivate && !(isOwner || isAdmin) ? "This is Private information" : foundUser.address,
            roles: isPrivate && !(isOwner || isAdmin) ? "This is Private information" : foundUser.roles.map(role => role.name),
            email: isPrivate && !(isOwner || isAdmin) ? "This is Private information" : foundUser.email,
            phonenumber: isPrivate && !(isOwner || isAdmin) ? "This is Private information" : foundUser.phonenumber,
            isActive: foundUser.isActive,
            isEditable: isOwner ? true : false,
            createdAt: foundUser.createdAt,
            updatedAt: foundUser.updatedAt,
        };

        return res.status(StatusCodes.OK).json({
            message: "User profile fetched successfully",
            userProfile,
        });

    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error",
        });
    }
};


export const verified_OTP = async (req, res) => {
    const cookies = req.cookies[COOKIE_PATHS.REGISTER_VERIFY.CookieName];
    const otp = req.body.otp;
    if (!cookies) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: 'Verify OTP failed, Unauthorized' });
    }

    if (!otp) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: 'Verify OTP failed, OTP is required' });
    }

    try {
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.REGISTER_VERIFY.CookieName, 'id');
        const redisTokenKey = `register:${userId}`;
        const redisToken = await getRedisClient.get(redisTokenKey);
        if (!redisToken || redisToken !== cookies) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Verify OTP failed, token expired or invalid'
            });
        }
        const redisOTPKey = `otp:signup:${userId}`;
        const redisOTP = await getRedisClient.get(redisOTPKey);
        if (!redisOTP) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Verify OTP failed, OTP expired or not found'
            });
        }

        if (redisOTP !== otp) {
            return res.status(StatusCodes.FORBIDDEN).json({
                message: 'Verify OTP failed, incorrect OTP'
            });
        }

        const foundUser = await user.findById(userId);
        if (!foundUser) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'User not found' });
        }

        foundUser.isActive = true;
        const userLoginPayLoad = {
            id: foundUser._id,
            email: foundUser.email,
            roles: foundUser.roles.map(role => role.name),
            tokenType: TOKEN_TYPE.ACCESS_TOKEN.name,
        }
        const newAccessToken = await getCookies({
            PayLoad: userLoginPayLoad,
            path: COOKIE_PATHS.ACCESS_TOKEN.Path,
            cookieName: COOKIE_PATHS.ACCESS_TOKEN.CookieName,
            maxAge: TOKEN_TYPE.ACCESS_TOKEN.maxAge,
            expiresIn: TOKEN_TYPE.ACCESS_TOKEN.expiresIn,
            res
        });
        foundUser.tokens.push(
            {
                type: TOKEN_TYPE.ACCESS_TOKEN.name,
                token: newAccessToken,
                signedAt: Date.now(),
                expiredAt: Date.now() + TOKEN_TYPE.ACCESS_TOKEN.maxAge,
            }
        );
        await foundUser.save();
        await Promise.all([
            getRedisClient.del(redisTokenKey),
            getRedisClient.del(redisOTPKey)
        ]);
        return res.status(StatusCodes.OK).json({
            message: 'OTP verified successfully, user activated'
        });
    } catch (err) {
        console.error('Verify OTP Error:', err);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: 'Verify OTP failed, Internal Server Error' });
    }
};


export const resendActivationOTP = async (req, res) => {
    try {
        const cookieName = COOKIE_PATHS.REGISTER_VERIFY.CookieName;
        const cookiePath = COOKIE_PATHS.REGISTER_VERIFY.Path;

        const existingCookie = req.cookies[cookieName];
        if (!existingCookie) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "No registration cookie found"
            });
        }

        const userId = getUserFieldFromToken(req, cookieName, 'id');
        if (!userId) {
            res.clearCookie(cookieName, {
                path: cookiePath,
                httpOnly: true,
                secure: true,
                sameSite: 'Strict'
            });
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Invalid registration cookie"
            });
        }

        const foundUser = await UserModel.findById(userId).lean();
        if (!foundUser) {
            return res.status(StatusCodes.NOT_FOUND).json({
                message: "User not found"
            });
        }

        const redisOTPKey = `otp:signup:${userId}`;
        const otpTTL = await getRedisClient.ttl(redisOTPKey);

        const newOTP = otpGenerator();

        // Nếu vẫn còn OTP trong Redis thì ghi đè
        if (otpTTL > 0) {
            await getRedisClient.set(redisOTPKey, newOTP, { EX: 60 * 15 });
        } else {
            // Nếu không còn nhưng user chưa active thì cũng cấp lại
            if (!foundUser.active) {
                await getRedisClient.set(redisOTPKey, newOTP, { EX: 60 * 15 });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Account already activated"
                });
            }
        }

        // Gửi email OTP mới
        try {
            await sendMailService({
                email: foundUser.email,
                username: foundUser.username,
                otp: newOTP
            });

            return res.status(StatusCodes.OK).json({
                message: "OTP đã được gửi lại thành công",
                expiresIn: "15 phút"
            });
        } catch (error) {
            console.error("Lỗi gửi mail OTP:", error);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Không thể gửi OTP, vui lòng thử lại sau"
            });
        }
    } catch (error) {
        console.error("Error in Resend Activation OTP:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error in Resend Activation OTP',
            error: {
                message: error.message || "An unknown error occurred",
                details: error.errors || {}
            }
        });
    }
};


export const forgot_password = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) return res.status(400).json({ message: "Email is required" });

        const userFound = await user.findOne({ email });
        if (!userFound) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

        const otp = otpGenerator()

        await getRedisClient.setEx(`forgotpassword:${userFound.email}`, 60 * 15, otp);
        const forgotPasswordPayLoad = {
            email: userFound.email,
            tokenType: TOKEN_TYPE.FORGOT_PASSWORD.name,
        }
        const forgotPasswordCookies = await getCookies({
            PayLoad: forgotPasswordPayLoad,
            path: COOKIE_PATHS.FORGOT_PASSWORD.Path,
            cookieName: COOKIE_PATHS.FORGOT_PASSWORD.CookieName,
            maxAge: TOKEN_TYPE.FORGOT_PASSWORD.maxAge,
            expiresIn: TOKEN_TYPE.FORGOT_PASSWORD.expiresIn,
            res
        });

        await sendMailForgotPassword({
            email: userFound.email,
            username: userFound.username,
            otp: otp,
        });
        return res.status(200).json({ message: 'Otp has been sent via email!' });
    } catch (err) {
        console.error('Error in forgot_password:', err);
        return res.status(500).json({
            message: 'An error occurred while processing your request.',
            error: err.message || 'Unknown error',
            details: err,
        });
    }
};

export const verified_OTP_forgot_password = async (req, res) => {
    const tokenType = getUserFieldFromToken(req, COOKIE_PATHS.FORGOT_PASSWORD.CookieName, 'tokenType');
    console.log(tokenType);
    if (!tokenType || tokenType != TOKEN_TYPE.FORGOT_PASSWORD.name) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access Denied : token-type' });
    }
    const email = getUserFieldFromToken(req, COOKIE_PATHS.FORGOT_PASSWORD.CookieName, 'email');
    if (!email) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access Denied : email' });
    }
    const { otp } = req.body;
    if (!otp) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'OTP is required' });
    }

    try {
        const userFound = await user.findOne({ email });
        if (!userFound) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        const storedOtp = await getRedisClient.get(`forgotpassword:${email}`);

        if (!storedOtp || storedOtp !== otp) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired OTP' });
        }
        await getRedisClient.del(`forgotpassword:${email}`);
        res.clearCookie(TOKEN_TYPE.FORGOT_PASSWORD.name, {
            path: COOKIE_PATHS.FORGOT_PASSWORD.Path,
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        });

        const verifiedOtpForgotPasswordPayLoad = {
            email: email,
            tokenType: TOKEN_TYPE.ACCEPT_RESET_PASSWORD.name,
        }
        await getCookies({
            PayLoad: verifiedOtpForgotPasswordPayLoad,
            path: COOKIE_PATHS.ACCEPT_RESET_PASSWORD,
            cookieName: COOKIE_PATHS.ACCEPT_RESET_PASSWORD.CookieName,
            maxAge: TOKEN_TYPE.ACCEPT_RESET_PASSWORD.maxAge,
            expiresIn: TOKEN_TYPE.ACCEPT_RESET_PASSWORD.expiresIn,
            res
        });

        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (err) {
        console.error('Error in verify_otp:', err);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'An error occurred while processing your request.',
            error: err.message || 'Unknown error',
        });
    }
}
export const reset_password = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const acceptResetPasswordCookies = getUserFieldFromToken(req, COOKIE_PATHS.ACCEPT_RESET_PASSWORD.CookieName, 'tokenType');
    if (!acceptResetPasswordCookies || acceptResetPasswordCookies !== TOKEN_TYPE.ACCEPT_RESET_PASSWORD.name) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access Denied' });
    }
    const resetPasswordEmail = getUserFieldFromToken(req, COOKIE_PATHS.ACCEPT_RESET_PASSWORD.CookieName, 'email');

    try {
        if (!resetPasswordEmail) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }
        if (newPassword !== confirmPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Passwords do not match' });
        }

        const userFound = await user.findOne({ email: resetPasswordEmail });
        if (!userFound) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        const resetPasswordPayLoad = {
            id: userFound._id.toString(),
            email: userFound.email,
            tokenType: TOKEN_TYPE.REPORT_COMPROMISED.name,
        }
        const reportCompromisedToken = await getCookies({
            PayLoad: resetPasswordPayLoad,
            path: COOKIE_PATHS.REPORT_COMPROMISED.Path,
            cookieName: COOKIE_PATHS.REPORT_COMPROMISED.CookieName,
            maxAge: TOKEN_TYPE.REPORT_COMPROMISED.maxAge,
            expiresIn: TOKEN_TYPE.REPORT_COMPROMISED.expiresIn,
            res
        });
        const tokenIndex = userFound.tokens.findIndex(t => t.type === TOKEN_TYPE.REPORT_COMPROMISED.name);

        if (tokenIndex !== -1) {
            userFound.tokens[tokenIndex] = {
                type: TOKEN_TYPE.REPORT_COMPROMISED.name,
                token: reportCompromisedToken,
                signedAt: Date.now().toString(),
                expiredAt: (Date.now() + 86400000).toString()
            };
        } else {

            userFound.tokens.push({
                type: TOKEN_TYPE.REPORT_COMPROMISED.name,
                token: reportCompromisedToken,
                signedAt: Date.now().toString(),
                expiredAt: (Date.now() + 86400000).toString()
            });
        }
        userFound.password = newPassword;

        const usave = await userFound.save();
        await sendMailNotification({
            email: userFound.email,
            username: userFound.username,
            subject: "🔐 Xác Nhận Đặt Lại Mật Khẩu",
            text: `Xin chào ${userFound.username},\n\nMật khẩu tài khoản ${userFound.email} của bạn đã được đặt lại thành công.\n\nNếu bạn không thực hiện thay đổi này, vui lòng truy cập vào liên kết bên dưới để báo cáo tài khoản bị xâm phạm.\n\nTrân trọng.`,
            html: `
                <div style="background: linear-gradient(145deg, #ffffff 0%, #f3f4f6 100%); padding: 25px; border-radius: 12px; margin-bottom: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="https://i.imgur.com/YckHqaP.png" alt="Security Alert" style="width: 80px; margin-bottom: 15px;">
                        <h2 style="color: #2c3e50; margin: 0; font-size: 24px; font-weight: 600;">Thông Báo Bảo Mật</h2>
                    </div>
                    
                    <div style="background-color: #ffffff; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                        <p style="font-size: 16px; color: #34495e; margin-bottom: 20px; line-height: 1.6;">
                            Xin chào <strong style="color: #2c3e50; font-size: 18px;">${userFound.username}</strong>,
                        </p>
                        
                        <div style="background: linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%); border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #3498db;">
                            <p style="color: #34495e; margin: 0; line-height: 1.6;">
                                Mật khẩu cho tài khoản <strong style="color: #2c3e50;">${userFound.email}</strong> của bạn đã được 
                                <span style="color: #27ae60; font-weight: 600;">đặt lại thành công</span>.
                            </p>
                        </div>
                        
                        <div style="background-color: #fff3cd; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                            <div style="display: flex; align-items: center; margin-bottom: 10px;">
                                <span style="font-size: 24px; margin-right: 10px;">⚠️</span>
                                <p style="color: #8a6d3b; margin: 0; font-weight: 600;">Cảnh Báo Bảo Mật</p>
                            </div>
                            <p style="color: #8a6d3b; margin: 10px 0 0 0; line-height: 1.6;">
                                Nếu bạn không thực hiện thay đổi này, vui lòng 
                                <a href="http://localhost:4000/api/auth/protect/report-compromised?token=${reportCompromisedToken}" 
                                   style="color: #e74c3c; font-weight: 600; text-decoration: none; border-bottom: 2px solid #e74c3c;"
                                   target="_blank">
                                   nhấp vào đây
                                </a> 
                                để báo cáo tài khoản của bạn đã bị xâm phạm.
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 25px; padding: 20px; background: rgba(255,255,255,0.8); border-radius: 8px;">
                        <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                            Đây là email tự động. Vui lòng không trả lời email này.
                        </p>
                    </div>
                </div>
            `,
        });
        res.clearCookie(TOKEN_TYPE.ACCEPT_RESET_PASSWORD.name, { httpOnly: true, path: COOKIE_PATHS.ACCEPT_RESET_PASSWORD.Path });

        return res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
        console.error('Error in reset_password:', err);
        return res.status(500).json({
            message: 'An error occurred while processing your request.',
            error: err.message || 'Unknown error',
        });
    }
};


export const report_compromised_account = async (req, res) => {
    const token = req.query.token

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const decodedUser = jwt.verify(token, SECRET_KEY);
        const userID = decodedUser.id;
        const userEmail = decodedUser.email

        const foundUser = await user.findOne({ _id: userID, email: userEmail });
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (foundUser.isActive == false) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Req failed' })
        }
        foundUser.isActive = false;
        foundUser.isCompromised = true;
        foundUser.tokens = foundUser.tokens.filter((t) => t.token !== token);
        await foundUser.save();

        // await sendMailNotification({ email: foundUser.email });

        return res.status(200).json({ message: 'Account reported as compromised' });
    } catch (error) {
        console.error('Error in report_compromised_account:', error);

        const isTokenExpired = error.name === 'TokenExpiredError';
        return res.status(isTokenExpired ? 401 : 500).json({
            message: isTokenExpired
                ? 'Token has expired. Please request a new report link.'
                : 'An error occurred while processing your request.',
            error: error.message || 'Unknown error',
        });
    }
};

export const requestReactivation = async (req, res) => {
    const { email } = req.body;

    const foundUser = await user.findOne({ email });
    if (!foundUser || !foundUser.isCompromised) {
        return res.status(400).json({ message: 'No compromised account found with this email' });
    }

    const reactivationToken = jwt.sign(
        { id: foundUser._id, email: foundUser.email },
        SECRET_KEY,
        { expiresIn: '15m' }
    );

    // Gửi mail xác thực
    await sendMailService({
        email,
        subject: "Kích Hoạt Lại Tài Khoản",
        html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%); border-radius: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                    <img src="https://i.imgur.com/YckHqaP.png" alt="Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
                    <h1 style="color: #2c3e50; margin: 0; font-size: 28px; font-weight: 600;">Kích Hoạt Lại Tài Khoản</h1>
                    <div style="width: 80px; height: 4px; background: linear-gradient(to right, #3498db, #2ecc71); margin: 15px auto; border-radius: 2px;"></div>
                </div>

                <div style="background-color: #ffffff; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 25px;">
                    <p style="color: #34495e; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                        Để kích hoạt lại tài khoản của bạn, vui lòng nhấp vào nút bên dưới:
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://yourdomain.com/reactivate?token=${reactivationToken}" 
                           style="display: inline-block; padding: 15px 35px; background: linear-gradient(to right, #3498db, #2ecc71); 
                                  color: #ffffff; text-decoration: none; border-radius: 25px; font-weight: 600; 
                                  transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);">
                            Kích Hoạt Tài Khoản
                        </a>
                    </div>

                    <div style="background-color: #fff8e1; border-left: 4px solid #ffa000; padding: 15px; margin-top: 25px; border-radius: 5px;">
                        <p style="color: #795548; margin: 0; font-size: 14px;">
                            ⚠️ Lưu ý: Liên kết này sẽ hết hạn sau 15 phút. Nếu bạn không yêu cầu kích hoạt lại tài khoản, 
                            vui lòng bỏ qua email này.
                        </p>
                    </div>
                </div>

                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #7f8c8d; font-size: 14px; margin: 0;">
                        Đây là email tự động. Vui lòng không trả lời email này.
                    </p>
                    <div style="margin-top: 20px;">
                        <a href="#" style="color: #3498db; text-decoration: none; margin: 0 10px;">Website</a>
                        <a href="#" style="color: #3498db; text-decoration: none; margin: 0 10px;">Hỗ Trợ</a>
                        <a href="#" style="color: #3498db; text-decoration: none; margin: 0 10px;">Điều Khoản</a>
                    </div>
                    <p style="color: #95a5a6; font-size: 12px; margin-top: 20px;">
                        © ${new Date().getFullYear()} Project_G. All rights reserved.
                    </p>
                </div>
            </div>
        `
    });

    return res.status(200).json({ message: 'Reactivation link has been sent to your email' });
};

export const reactivateCompromisedAccount = async (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const foundUser = await user.findOne({ _id: decoded.id, email: decoded.email });

        if (!foundUser || !foundUser.isCompromised) {
            return res.status(400).json({ message: 'Invalid or already reactivated account' });
        }

        foundUser.isActive = true;
        foundUser.isCompromised = false;
        foundUser.tokens = []; // Reset token để tránh reuse
        await foundUser.save();

        return res.status(200).json({ message: 'Account has been reactivated successfully' });

    } catch (error) {
        const expired = error.name === 'TokenExpiredError';
        return res.status(expired ? 401 : 500).json({
            message: expired ? 'Token expired. Request a new reactivation link.' : 'Server error',
            error: error.message
        });
    }
};
