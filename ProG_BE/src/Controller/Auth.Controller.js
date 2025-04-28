import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { COOKIE_PATHS, SECRET_KEY, TOKEN_TYPE } from '../../config.js';
import user from '../models/user.js';
import { getCookies } from '../Middlewares/Cookies.js';
import Role from '../models/Role.js';
import { _encrypt } from '../utils/_crypto_.js';
import { redisClient } from '../Cache/User_Cache.js';
import { otpGenerator } from '../services/Otp/createOTP.js';
import { sendMailForgotPassword, sendMailNotification, sendMailService } from '../services/sendMailService/nodeMailer.service.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { getUserFieldFromToken } from '../services/User/User.service.js';
import mongoose from 'mongoose';

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
            redisClient.set(redisKey, generateOTP, { EX: 60 * 15 })
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

        if (!username && !email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username or Email is required" });
        }
        if (!password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password is required" });
        }

        const foundUser = await user.findOne(email ? { email } : { username }).populate("roles");
        if (!foundUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid Username or Email" });
        }

        if (!foundUser.isActive) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Login Failed, User is not active" });
        }

        // So sánh password
        const isPasswordValid = await user.comparePassword(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Password' });
        }

        const userLoginPayLoad = {
            id: foundUser._id,
            email: foundUser.email,
            roles: foundUser.roles.map(role => role.name), // Add roles here
            tokenType: TOKEN_TYPE.ACCESS_TOKEN.name,
        }
        const newCookies = await getCookies({
            PayLoad: userLoginPayLoad,
            path: COOKIE_PATHS.ACCESS_TOKEN.Path,
            cookieName: COOKIE_PATHS.ACCESS_TOKEN.CookieName,
            maxAge: TOKEN_TYPE.ACCESS_TOKEN.maxAge,
            expiresIn: TOKEN_TYPE.ACCESS_TOKEN.expiresIn,
            res
        });
        const token = await manageTokens(foundUser, newCookies, TOKEN_TYPE.ACCESS_TOKEN.name);

        return res.status(StatusCodes.OK).json({
            message: "Login Successful",
            user: {
                id: foundUser._id,
                username: foundUser.username,
                gender: foundUser.gender,
                phonenumber: foundUser.phonenumber,
                address: foundUser.address,
                avatar: foundUser.avatar,
                email: foundUser.email,
                roles: foundUser.roles.map(role => role.name)
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", error: err.message });
    }
};

export const logoutHandler = async (req, res) => {
    const token = req.cookies[COOKIE_PATHS.ACCESS_TOKEN.CookieName];

    if (!token) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Token is missing. Unauthorized access." });
    }
    const accessTokenType = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'tokenType');
    if (!accessTokenType || accessTokenType !== TOKEN_TYPE.ACCESS_TOKEN.name) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Permission is Invalid -> 🚫 Access Denied" });
    }

    try {
        const userDecoded = jwt.verify(token, process.env.JWT_SECRET);
        const _user = await user.findById(userDecoded.id);

        if (!_user) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }
        _user.tokens = _user.tokens.filter(t => t.token !== token);
        await _user.save();
        res.clearCookie(TOKEN_TYPE.ACCESS_TOKEN.name);

        return res
            .status(StatusCodes.OK)
            .json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Error during logout:", error.message);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Something went wrong during logout." });
    }
};

export const refreshToken = async (req, res) => {
    try {
        // Lấy refresh token từ cookie
        const refreshToken = req.cookies[COOKIE_PATHS.REFRESH_TOKEN.CookieName];
        if (!refreshToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Missing refresh token' });
        }

        // Lấy userId từ access token
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

        // Tạo payload cho tokens 
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
        let tokensArray = _user.tokens || [];
        const now = Date.now();
        tokensArray = tokensArray.filter(tokenObj => (now - parseInt(tokenObj.signedAt)) < 86400000);
        if (tokensArray.length >= 5) {
            tokensArray.shift();
        }

        tokensArray.push({ type, token, signedAt: now, expiredAt: now + 86400000 });
        await user.updateOne({ _id: _user._id }, { $set: { tokens: tokensArray } });
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
        const currUserId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        const currUserRoles = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'roles') || [];
        const currAccessTokenType = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'tokenType');
        const targetUser = (req.params.targetUser || currUserId).trim();

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
            const isTokenValid = foundUser.tokens?.some(tokenObj =>
                tokenObj.token === req.cookies[COOKIE_PATHS.ACCESS_TOKEN.CookieName]
            );
            if (!isTokenValid) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - Token mismatch" });
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
        const redisToken = await redisClient.get(redisTokenKey);
        if (!redisToken || redisToken !== cookies) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Verify OTP failed, token expired or invalid'
            });
        }
        const redisOTPKey = `otp:signup:${userId}`;
        const redisOTP = await redisClient.get(redisOTPKey);
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
            redisClient.del(redisTokenKey),
            redisClient.del(redisOTPKey)
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
        const otpTTL = await redisClient.ttl(redisOTPKey);

        const newOTP = otpGenerator();

        // Nếu vẫn còn OTP trong Redis thì ghi đè
        if (otpTTL > 0) {
            await redisClient.set(redisOTPKey, newOTP, { EX: 60 * 15 });
        } else {
            // Nếu không còn nhưng user chưa active thì cũng cấp lại
            if (!foundUser.active) {
                await redisClient.set(redisOTPKey, newOTP, { EX: 60 * 15 });
            } else {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Account already activated"
                });
            }
        }

        // Gửi OTP qua email
        setImmediate(() => {
            sendMailService({
                email: foundUser.email,
                username: foundUser.username,
                otp: newOTP
            }).catch(err => console.error("Send mail failed:", err));
        });

        return res.status(StatusCodes.OK).json({
            message: "A new OTP has been sent to your email",
            email: foundUser.email
        });

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

        const userFound = await user.findOne({ email });
        if (!userFound) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

        const otp = otpGenerator()

        await redisClient.setEx(`forgotpassword:${userFound.email}`, 60 * 15, otp);
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
    const tokenType = getUserFieldFromToken(req, COOKIE_PATHS.FORGOT_PASSWORD, 'tokenType');
    if (!tokenType || tokenType !== TOKEN_TYPE.FORGOT_PASSWORD_VERIFIED.name) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access Denied' });
    }
    const email = getUserFieldFromToken(req, COOKIE_PATHS.FORGOT_PASSWORD, 'email');
    if (!email) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access Denied' });
    }
    const { otp } = req.body;

    try {
        const userFound = await user.findOne({ email });
        if (!userFound) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        const storedOtp = await redisClient.get(`forgotpassword:${email}`);

        if (!storedOtp || storedOtp !== otp) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired OTP' });
        }
        await redisClient.del(`forgotpassword:${email}`);
        res.clearCookie(TOKEN_TYPE.FORGOT_PASSWORD.name, {
            path: COOKIE_PATHS.FORGOT_PASSWORD,
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
        });

        const verifiedOtpForgotPasswordPayLoad = {
            email: email,
            tokenType: TOKEN_TYPE.FORGOT_PASSWORD_VERIFIED.name,
        }
        await getCookies({
            PayLoad: verifiedOtpForgotPasswordPayLoad,
            path: COOKIE_PATHS.FORGOT_PASSWORD_VERIFIED,
            CookieName: COOKIE_PATHS.FORGOT_PASSWORD_VERIFIED.CookieName,
            maxAge: TOKEN_TYPE.FORGOT_PASSWORD_VERIFIED.maxAge,
            expiresIn: TOKEN_TYPE.FORGOT_PASSWORD_VERIFIED.expiresIn,
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
    const acceptResetPasswordCookies = getUserFieldFromToken(req, COOKIE_PATHS.ACCEPT_RESET_PASSWORD, 'tokenType');
    if (!acceptResetPasswordCookies || acceptResetPasswordCookies !== TOKEN_TYPE.ACCEPT_RESET_PASSWORD.name) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Access Denied' });
    }
    const resetPasswordEmail = getUserFieldFromToken(req, COOKIE_PATHS.ACCEPT_RESET_PASSWORD, 'email');

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
            path: COOKIE_PATHS.REPORT_COMPROMISED,
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
        console.log(usave);
        await sendMailNotification({
            email: userFound.email,
            username: userFound.username,
            subject: "🚨 Password Reset Successful 🚨",
            text: `Hi ${userFound.username},\n\nYour password of Account ${userFound.email} has been successfully reset.\n\n
            Please check again, if the password change was not done by you, please go to the report a compromised account section at this link.🫣
            \n\nThank you.`,
            html: `
                <p>Hi <strong>${userFound.username}</strong>,</p>
                <p>Your password for the account <strong>${userFound.email}</strong> has been <span style="color: #d35400;"><b>successfully reset</b></span>.</p>
                <p>If you did not request this change, please <a href="http://localhost:4000/api/auth/report/compromised?token=${reportCompromisedToken}" target="_blank" style="color: #e74c3c; font-weight: bold;">click here</a> to report your account as compromised.</p>
                <p style="color: #7f8c8d; font-size: 14px;">This is an automated email. Please do not reply.</p>
            `,
        });
        res.clearCookie(TOKEN_TYPE.ACCEPT_RESET_PASSWORD.name, { httpOnly: true, path: '/' });

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
        subject: "Reactivate your account",
        html: `<p>Click the link below to reactivate your account:</p>
               <a href="https://yourdomain.com/reactivate?token=${reactivationToken}">Reactivate Account</a>`
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
