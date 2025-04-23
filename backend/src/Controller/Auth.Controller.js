import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { SECRET_KEY } from '../../config.js';
import user from '../models/user.js';
import { getCookies } from '../Middlewares/Cookies.js';
import Role from '../models/Role.js';
import { _encrypt } from '../utils/_crypto_.js';
import { redisClient } from '../Cache/User_Cache.js';
import { otpGenerator } from '../services/Otp/createOTP.js';
import { sendMailForgotPassword, sendMailNotification, sendMailService } from '../services/sendMailService/nodeMailer.service.js';
// import moment from 'moment/moment.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';  // Import plugin UTC
import timezone from 'dayjs/plugin/timezone.js'; // Import plugin Timezone

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
// export const Signup_Handler = async (req, res) => {
//     try {
//         const { username, password, email } = req.body;

//         const CreateUser = new user({ username, password, email });

//         const role = await Role.findOne({ name: 'user' });
//         if (!role) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ message: "Role 'user' not found" });
//         }
//         CreateUser.roles = [role._id];

//         const token = await getCookies(CreateUser, res)

//         CreateUser.tokens = [{ type: "LOGIN-TOKEN", token, signedAt: Date.now().toString(), expiredAt: Date.now().toString() }];
//         const saveUser = await CreateUser.save();
//         console.log('User Created Successfully', saveUser);

//         const redisKey = `otp:${saveUser._id}`
//         const generateOTP = otpGenerator()
//         console.log("OPT Generated :", generateOTP);
//         console.log("Redis Key:", redisKey);

//         await redisClient.set(redisKey, generateOTP, { EX: 60 * 15 });
//         const temp = await redisClient.get(redisKey)
//         console.log("OTP from Redis:", temp);
//         await sendMailService({ email: saveUser.email, username: saveUser.username, otp: generateOTP });

//         return res.status(StatusCodes.CREATED).json({
//             message: `User registered successfully. Please verify OTP sent to your email ${saveUser.email}`,
//             userName: saveUser.username, emailmail: saveUser.email,
//             createAt: saveUser.createdAt, updatedAt: saveUser.updatedAt,
//             isActive: saveUser.isActive,
//             roles: ["user"]
//         })
//     } catch (error) {
//         console.error("Error in Create User Task:", error);
//         const errorMessage = error.message || "An unknown error occurred";
//         const errorDetails = error.errors || {};
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             message: 'Error in Create User Task',
//             error: { message: errorMessage, details: errorDetails }
//         });
//     }

// }
// export const Signup_Handler = async (req, res) => {
//     try {
//         const { username, password, email } = req.body;

//         // Kiểm tra role trước, tránh truy vấn dư thừa
//         const role = await Role.findOne({ name: 'user' });
//         if (!role) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ message: "Role 'user' not found" });
//         }

//         // Tạo user nhưng chưa lưu ngay
//         const CreateUser = new user({ username, password, email, roles: [role._id] });

//         // Tạo token và lưu vào user
//         const token = jwt.sign({ id: CreateUser._id }, SECRET_KEY, { expiresIn: '24h' });

//         // Đặt cookies
//         res.cookie('token', token, { maxAge: 60 * 60 * 24 * 1000, httpOnly: true, secure: true });

//         // Thêm token vào user
//         CreateUser.tokens = [{ type: "LOGIN-TOKEN", token, signedAt: Date.now().toString(), expiredAt: Date.now().toString() }];

//         // Lưu user vào DB
//         const saveUser = await CreateUser.save();
//         console.log('User Created Successfully', saveUser);

//         // Tạo OTP & Redis Key
//         const redisKey = `otp:${saveUser._id}`;
//         const generateOTP = otpGenerator();
//         console.log("OTP Generated:", generateOTP);

//         // Lưu OTP vào Redis (nếu chưa có)
//         const isExist = await redisClient.get(redisKey);
//         if (!isExist) {
//             await redisClient.set(redisKey, generateOTP, { EX: 60 * 15 });
//         }

//         // Trả về phản hồi ngay lập tức, gửi mail sau
//         res.status(StatusCodes.CREATED).json({
//             user: {
//                 id: saveUser._id,
//                 username: saveUser.username,
//                 email: saveUser.email,
//                 createdAt: dayjs(saveUser.createdAt).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY HH:mm:ss (UTC+7)"),
//                 updatedAt: dayjs(saveUser.updatedAt).tz("Asia/Ho_Chi_Minh").format("DD-MM-YYYY HH:mm:ss (UTC+7)"),
//                 isActive: saveUser.isActive,
//                 emailVerified: saveUser.emailVerified || false,
//                 roles: "user"
//             }
//         });

//         // Gửi email bất đồng bộ để tránh chặn quá trình chính
//         sendMailService({ email: saveUser.email, username: saveUser.username, otp: generateOTP })
//             .catch(err => console.error("Send mail failed:", err));

//     } catch (error) {
//         console.error("Error in Create User Task:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             message: 'Error in Create User Task',
//             error: { message: error.message || "An unknown error occurred", details: error.errors || {} }
//         });
//     }
// };

export const Signup_Handler = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const role = await Role.findOne({ name: 'user' });
        if (!role) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Role 'user' not found" });
        }

        const CreateUser = new user({ username, password, email, roles: [role._id] });
        const token = jwt.sign({ id: CreateUser._id }, SECRET_KEY, { expiresIn: '24h' });

        res.cookie('token', token, { maxAge: 60 * 60 * 24 * 1000, httpOnly: true, secure: true });

        CreateUser.tokens = [{ type: "LOGIN-TOKEN", token, signedAt: Date.now().toString(), expiredAt: Date.now().toString() }];

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

        // ✅ Chạy lưu user và gửi OTP song song để tối ưu tốc độ
        const generateOTP = otpGenerator();
        const redisKey = `otp:${CreateUser._id}`;

        Promise.all([
            CreateUser.save(), // Lưu user vào DB
            redisClient.set(redisKey, generateOTP, { EX: 60 * 15 }) // Lưu OTP vào Redis
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
// thêm xác thực otp lúc login 


// export const loginHandler = async (req, res) => {
//     const username = req.body.username;
//     const password = req.body.password;
//     const email = req.body.email;

//     if (!username && !email) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username or Email is required' });
//     }

//     if (!password) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Password is required' });
//     }

//     try {
//         let userQuery = {};
//         if (email) {
//             userQuery.email = email
//         } else if (username) {
//             userQuery.username = username
//         }
//         console.log(userQuery);
//         const foundUser = await user.findOne(userQuery).populate("roles");
//         console.log(foundUser);

//         if (!foundUser) {
//             return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Username or Email' });
//         }
//         if (foundUser.isActive === false) {
//             return res.status(StatusCodes.FORBIDDEN).json({ message: 'Login Failed , User is not active' });
//         }

//         const isPasswordValid = await user.comparePassword(password, foundUser.password);
//         if (!isPasswordValid) {
//             return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Password' });
//         }

//         // Xử lý cookies và tokens
//         const newCookies = await getCookies(foundUser, res);
//         console.log(newCookies.cookie)
//         const token = await manageTokens(foundUser, newCookies, "LOGIN-TOKEN");

//         return res.status(StatusCodes.OK).json({ message: 'Login Successful', token });
//     } catch (err) {
//         console.error("Login error:", err);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: err.message });
//     }
// };
export const loginHandler = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username && !email) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username or Email is required" });
        }
        if (!password) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password is required" });
        }

        // Tìm user bằng email hoặc username
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


        // Xử lý cookies
        const newCookies = await getCookies(foundUser, res);
        console.log(newCookies);

        // Gọi `manageTokens` và nhận về token mới
        const token = await manageTokens(foundUser, newCookies, "LOGIN-TOKEN");

        return res.status(StatusCodes.OK).json({ message: "Login Successful", token });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error", error: err.message });
    }
};

export const logoutHandler = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Token is missing. Unauthorized access." });
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

        // Xóa cookie token
        res.clearCookie("token");

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

// export const refreshToken = async (req, res) => {
//     const currentToken = req.cookies.token;
//     if (!currentToken) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
//     try {
//         const user = jwt.verify(currentToken, SECRET_KEY);
//         const newToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1d' });
//         res.cookie('token', newToken, { expires: new Date(Date.now() + 86400000), httpOnly: true, secure: true });
//         return res.status(StatusCodes.OK).json({ message: 'Token refreshed successfully' });
//     } catch (err) {
//         return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid token', error: err.message });
//     }
// }
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

        // Tìm user và kiểm tra xem token có tồn tại không
        const foundUser = await user.findById(decoded.id);
        if (!foundUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found' });
        }

        // Kiểm tra xem token có nằm trong danh sách token hợp lệ không
        const validToken = foundUser.tokens.find(tokenObj => tokenObj.token === currentToken);
        if (!validToken) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Token is not valid or has been revoked' });
        }

        // Xóa token cũ khỏi danh sách
        foundUser.tokens = foundUser.tokens.filter(tokenObj => tokenObj.token !== currentToken);

        // Tạo token mới
        const newToken = jwt.sign({ id: foundUser._id }, SECRET_KEY, { expiresIn: '1d' });

        // Lưu token mới vào danh sách token của user
        foundUser.tokens.push({
            type: "REFRESH-TOKEN",
            token: newToken,
            signedAt: Date.now(),
            expiredAt: Date.now() + 86400000
        });

        await foundUser.save(); // Cập nhật user

        // Set lại cookie với token mới
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
// export const manageTokens = async (_user, token, type) => {
//     try {
//         let tokensArray = _user.tokens || [];
//         console.log("Existing Tokens:", tokensArray);

//         if (tokensArray.length) {
//             tokensArray = tokensArray.filter((tokenObj) => {
//                 const timeDiff = (Date.now() - parseInt(tokenObj.signedAt)) / 1000;
//                 return timeDiff < 86400;
//             });
//         }
//         tokensArray.push({ type, token, signedAt: Date.now().toString(), expiredAt: (Date.now() + 86400000).toString() });
//         await user.findByIdAndUpdate(_user._id, { tokens: tokensArray }, { new: true });
//         console.log("Updated Tokens:", tokensArray);
//     } catch (error) {
//         console.error("Error managing tokens:", error);
//         throw new Error("Unable to manage tokens");
//     }
// };
export const manageTokens = async (_user, token, type) => {
    try {
        let tokensArray = _user.tokens || [];
        console.log("Existing Tokens:", tokensArray);

        // Lọc các token còn hạn sử dụng (< 24h)
        const now = Date.now();
        tokensArray = tokensArray.filter(tokenObj => (now - parseInt(tokenObj.signedAt)) < 86400000);

        // Giới hạn số token hoạt động (tối đa 5)
        if (tokensArray.length >= 5) {
            tokensArray.shift(); // Xóa token cũ nhất
        }

        // Thêm token mới
        tokensArray.push({ type, token, signedAt: now, expiredAt: now + 86400000 });

        // Cập nhật user với danh sách token mới
        await user.updateOne({ _id: _user._id }, { $set: { tokens: tokensArray } });

        console.log("Updated Tokens:", tokensArray);
        return token;  // Trả về token để sử dụng trong loginHandler
    } catch (error) {
        console.error("Error managing tokens:", error);
        throw new Error("Unable to manage tokens");
    }
};


// export const getProfile = async (req, res) => {
//     console.log(req.cookies);

//     try {
//         const userToken = req.cookies.token;
//         if (!userToken) {
//             return res
//                 .status(StatusCodes.UNAUTHORIZED)
//                 .json({ message: 'Unauthorized - No token provided' });
//         }

//         let decodedUser;
//         try {
//             decodedUser = jwt.verify(userToken, SECRET_KEY);
//         } catch (err) {
//             console.error("Invalid or expired token:", err.message);
//             return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
//         }

//         const userID = decodedUser.id;
//         const foundUser = await user.findOne({
//             $or: [
//                 { _id: userID }, // Tìm bằng ObjectId
//                 { id: userID }   // Tìm bằng UUID
//             ]
//         }).populate('roles', 'name');

//         if (!foundUser) {
//             return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
//         }

//         // Kiểm tra token có tồn tại trong cơ sở dữ liệu
//         const tokenExists = foundUser.tokens.some((tokenObj) => tokenObj.token === userToken);
//         if (!tokenExists) {
//             return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized - Token mismatch' });
//         }

//         // Tạo profile trả về
//         const userProfile = {
//             username: foundUser.username,
//             email: foundUser.email, // Cân nhắc loại bỏ hoặc ẩn
//             roles: foundUser.roles.map((role) => role.name),
//             isActive: foundUser.isActive,
//             tokens: foundUser.tokens.length,
//             password: '**********', // Ẩn mật khẩu
//             createdAt: foundUser.createdAt,
//             updatedAt: foundUser.updatedAt,
//         };

//         return res.status(StatusCodes.OK).json({
//             message: 'User profile fetched successfully',
//             userProfile,
//         });
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//             message: 'Internal Server Error',
//             error: error.message,
//         });
//     }
// };
export const getProfile = async (req, res) => {
    try {
        const userToken = req.cookies?.token;
        if (!userToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - No token provided" });
        }

        // Xác minh token
        let decodedUser;
        try {
            decodedUser = jwt.verify(userToken, SECRET_KEY);
        } catch (err) {
            console.warn("🚨 Invalid or expired token:", err.message);
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid or expired token" });
        }

        // Tìm user bằng UUID (id) thay vì _id (ObjectId)
        const foundUser = await user.findOne({ _id: decodedUser.id }).populate("roles", "name");

        if (!foundUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

        // Kiểm tra token có hợp lệ trong danh sách tokens của user
        const isTokenValid = foundUser.tokens?.some(tokenObj => tokenObj.token === userToken);
        if (!isTokenValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized - Token mismatch" });
        }

        // Trả về thông tin user, ẩn các trường nhạy cảm
        const userProfile = {
            id: foundUser.id,
            username: foundUser.username,
            email: "********", // Ẩn email vì lý do bảo mật
            avatar: foundUser.avatar,
            phonenumber: foundUser.phonenumber ? "Hidden" : null, // Ẩn số điện thoại
            address: foundUser.address,
            roles: foundUser.roles.map(role => role.name),
            isActive: foundUser.isActive,
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
    const cookies = req.cookies.token;
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
        // Xác minh token JWT
        const decodedUser = jwt.verify(cookies, SECRET_KEY);
        const UserID = decodedUser.id;
        console.log(UserID);
        console.log(decodedUser)
        // Lấy OTP từ Redis
        const redisFound = await redisClient.get(`otp:${UserID}`);
        console.log(redisFound);
        if (!redisFound) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ message: 'Verify OTP failed, OTP expired or invalid' });
        }

        // Parse JSON và kiểm tra OTP
        let jsonParseUser;
        try {
            // jsonParseUser = JSON.parse(redisFound);
            jsonParseUser = redisFound
            console.log(jsonParseUser);
        } catch (parseError) {
            console.error('Failed to parse Redis data:', parseError);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ message: 'Server error while processing OTP' });
        }

        if (jsonParseUser != otp) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ message: 'Verify OTP failed, Invalid OTP' });
        }

        const userFound = await user.findById(UserID);
        if (!userFound) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: 'User not found' });
        }

        userFound.isActive = true;
        await userFound.save();
        await redisClient.del(`otp:${UserID}`);

        return res
            .status(StatusCodes.OK)
            .json({ message: 'Verify OTP successful, User is activated' });
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

        console.log('User:', userFound.email);

        const otp = otpGenerator()

        await redisClient.setEx(`forgotpassword:${userFound.email}`, 60 * 15, otp);

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
    const { email, otp } = req.body;

    try {
        // Lấy OTP từ Redis
        const storedOtp = await redisClient.get(`forgotpassword:${email}`);

        if (!storedOtp || storedOtp !== otp) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid or expired OTP' });
        }
        console.log(`OTP ${storedOtp} Will be deleted`);
        await redisClient.del(`forgotpassword:${email}`);

        const token = jwt.sign({ id: email }, SECRET_KEY, { expiresIn: '15m' });

        // Trả cookie
        res.cookie('resetPasswordToken', token, {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 60 * 1000,
        });
        // res.cookie('actionStatus', "ACCEPT-RESET-PASSWORD", {
        //     httpOnly: true,
        //     secure: true,
        //     maxAge: 15 * 60 * 1000,
        // });

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
    const { password1, password2 } = req.body;
    const token = req.cookies.resetPasswordToken;

    try {
        if (!token) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }

        const decodedUser = jwt.verify(token, SECRET_KEY);
        const email = decodedUser.id;
        console.log(decodedUser);
        if (password1 !== password2) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Passwords do not match' });
        }

        const userFound = await user.findOne({ email });
        if (!userFound) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }
        const token1 = jwt.sign({ id: userFound._id.toString() }, SECRET_KEY, { expiresIn: '24h' })
        const tokenIndex = userFound.tokens.findIndex(t => t.type === 'REPORT-COMPROMISED');

        if (tokenIndex !== -1) {

            userFound.tokens[tokenIndex] = {
                type: 'REPORT-COMPROMISED',
                token: token1,
                signedAt: Date.now().toString(),
                expiredAt: (Date.now() + 86400000).toString()
            };
        } else {

            userFound.tokens.push({
                type: 'REPORT-COMPROMISED',
                token: token1,
                signedAt: Date.now().toString(),
                expiredAt: (Date.now() + 86400000).toString()
            });
        }
        userFound.password = password1;

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
                <p>If you did not request this change, please <a href="http://localhost:4000/api/auth/report/compromised?token=${token1}" target="_blank" style="color: #e74c3c; font-weight: bold;">click here</a> to report your account as compromised.</p>
                <p style="color: #7f8c8d; font-size: 14px;">This is an automated email. Please do not reply.</p>
            `,
        });

        // res.clearCookie('resetPasswordToken');
        res.clearCookie('resetPasswordToken', { httpOnly: true, path: '/' });

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
