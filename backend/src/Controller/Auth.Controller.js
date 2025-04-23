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
        console.log("🚀 ~ file: Auth.Controller.js:40 ~ Signup_Handler ~ userSignUpPayLoad:", userSignUpPayLoad)
        const token = await getCookies(
            userSignUpPayLoad,
            COOKIE_PATHS.REGISTER_VERIFY.Path,
            COOKIE_PATHS.REGISTER_VERIFY.CookieName,
            TOKEN_TYPE.REGISTER_VERIFY.maxAge,
            TOKEN_TYPE.REGISTER_VERIFY.expiresIn,
            res
        );
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
        // console.log("🚀 ~ file: Auth.Controller.js:90 ~ loginHandler ~ foundUser:")
        // let roles = []
        // foundUser.roles.forEach((r) => {
        //     roles.push(r.name)
        // })
        // console.log(roles)
        const userLoginPayLoad = {
            id: foundUser._id,
            email: foundUser.email,
            roles: foundUser.roles.map(role => role.name), // Add roles here
            tokenType: TOKEN_TYPE.ACCESS_TOKEN.name,
        }
        console.log("🚀 ~ file: Auth.Controller.js:90 ~ loginHandler ~ userLoginPayLoad:", userLoginPayLoad)
        const newCookies = await getCookies(
            userLoginPayLoad,
            COOKIE_PATHS.ACCESS_TOKEN.Path,
            COOKIE_PATHS.ACCESS_TOKEN.CookieName,
            TOKEN_TYPE.ACCESS_TOKEN.maxAge,
            TOKEN_TYPE.ACCESS_TOKEN.expiresIn,
            res
        );
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
        // Lấy token từ cookie
        const currentToken = req.cookies.token;
        if (!currentToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }

        // Giải mã token
        let decoded;
        try {
            decoded = jwt.verify(currentToken, SECRET_KEY);
        } catch (err) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid or expired token', error: err.message });
        }
        const foundUser = await user.findById(decoded.id);
        if (!foundUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found' });
        }
        const validToken = foundUser.tokens.find(tokenObj => tokenObj.token === currentToken);

        if (!validToken) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Token is not valid or has been revoked' });
        }

        foundUser.tokens = foundUser.tokens.filter(tokenObj => tokenObj.token !== currentToken);
        const newToken = jwt.sign({ id: foundUser._id }, SECRET_KEY, { expiresIn: '1d' });
        foundUser.tokens.push({
            type: "REFRESH-TOKEN",
            token: newToken,
            signedAt: Date.now(),
            expiredAt: Date.now() + 86400000
        });

        await foundUser.save();

        res.cookie('token', newToken, {
            expires: new Date(Date.now() + 86400000),
            httpOnly: true,
            secure: true,
            sameSite: 'Strict'
        });

        return res.status(StatusCodes.OK).json({ message: 'Token refreshed successfully', token: newToken });

    } catch (err) {
        console.error("Refresh token error:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: err.message });
    }
};

export const manageTokens = async (_user, token, type) => {
    try {
        let tokensArray = _user.tokens || [];
        console.log("Existing Tokens:", tokensArray);

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

        // Base profile - Public info
        // const hideIfPrivate = (value) => (isPrivate && !(isOwner || isAdmin)) ? "This is Private information" : value;
        // const hideEmail = (value) => (isPrivate && !(isOwner || isAdmin)) ? "This is Private information" : value;
        // const hidePhone = (value) => (isPrivate && !(isOwner || isAdmin)) ? "This is Private information" : value;

        let userProfile = {
            id: foundUser._id.toString(),
            username: foundUser.username,
            fullName: foundUser.fullname,
            birthdate: foundUser.birthdate,
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
    console.log("🚀 ~ file: Auth.Controller.js:195 ~ verified_OTP ~ cookies:", req.cookies)
    console.log("🚀 ~ file: Auth.Controller.js:195 ~ verified_OTP ~ cookies:", cookies)
    console.log("🚀 ~ file: Auth.Controller.js:195 ~ verified_OTP ~ otp:", otp)
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
        console.log("🚀 ~ file: Auth.Controller.js:195 ~ verified_OTP ~ userId:", userId)
        const redisTokenKey = `register:${userId}`;
        const redisToken = await redisClient.get(redisTokenKey);
        console.log("🚀 ~ file: Auth.Controller.js:195 ~ verified_OTP ~ redisToken:", redisToken)
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
        const forgotPasswordCookies = await getCookies(
            forgotPasswordPayLoad,
            COOKIE_PATHS.FORGOT_PASSWORD,
            TOKEN_TYPE.FORGOT_PASSWORD.maxAge,
            TOKEN_TYPE.FORGOT_PASSWORD.expiresIn,
            res
        );

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
        await getCookies(
            verifiedOtpForgotPasswordPayLoad,
            COOKIE_PATHS.FORGOT_PASSWORD_VERIFIED,
            TOKEN_TYPE.FORGOT_PASSWORD_VERIFIED.maxAge,
            TOKEN_TYPE.FORGOT_PASSWORD_VERIFIED.expiresIn,
            res
        );

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
        const reportCompromisedToken = await getCookies(resetPasswordPayLoad, COOKIE_PATHS.REPORT_COMPROMISED, TOKEN_TYPE.REPORT_COMPROMISED.maxAge, TOKEN_TYPE.REPORT_COMPROMISED.expiresIn, res);
        const tokenIndex = userFound.tokens.findIndex(t => t.type === 'REPORT-COMPROMISED');

        if (tokenIndex !== -1) {

            userFound.tokens[tokenIndex] = {
                type: 'REPORT-COMPROMISED',
                token: reportCompromisedToken,
                signedAt: Date.now().toString(),
                expiredAt: (Date.now() + 86400000).toString()
            };
        } else {

            userFound.tokens.push({
                type: 'REPORT-COMPROMISED',
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
        // Giải mã token
        const decodedUser = jwt.verify(token, SECRET_KEY);
        const userID = decodedUser.id;
        console.log(decodedUser);
        // Tìm người dùng bằng ID
        const foundUser = await user.findById(userID);
        if (!foundUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        foundUser.isActive = false;
        foundUser.tokens = foundUser.tokens.filter((t) => t.token !== token);
        await foundUser.save();

        // Tùy chọn: Gửi thông báo qua email
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


export const report_compromised_account1 = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {

        const user = await user.findOne({
            'tokens.token': token,
            'tokens.type': 'REPORT-COMPROMISED'
        });

        if (!user) {
            return res.status(404).json({ message: 'Invalid or expired token' });
        }

        user.isActive = false;


        user.tokens = user.tokens.filter((t) => t.token !== token);

        await user.save();

        return res.status(200).json({ message: 'Account reported as compromised' });
    } catch (error) {
        console.error('Error in report_compromised_account1:', error);

        const isTokenExpired = error.name === 'TokenExpiredError';
        return res.status(isTokenExpired ? 401 : 500).json({
            message: isTokenExpired
                ? 'Token has expired. Please request a new report link.'
                : 'An error occurred while processing your request.',
            error: error.message || 'Unknown error',
        });
    }
};
