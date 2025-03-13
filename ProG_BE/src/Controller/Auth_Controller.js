import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { SECRET_KEY } from '../../config.js';
import user from '../models/user.js';
import { getCookies } from '../Middlewares/Cookies.js';
import Role from '../models/Role.js';
import { _encrypt } from '../utils/_crypto_.js';
import { redisClient } from '../Cache/User_Cache.js';
import { otpGenerator } from '../services/Otp/createOTP.js';
import { sendMailForgotPassword, sendMailNotification, sendMailService } from '../services/sendMailService/nodeMailer.js';

export const Signup_Handler = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        // Encrypt user information

        const CreateUser = new user({ username, password, email });

        const role = await Role.findOne({ name: 'user' });
        if (!role) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Role 'user' not found" });
        }
        CreateUser.roles = [role._id];
        const token = await getCookies(CreateUser, res)

        CreateUser.tokens = [{ type: "LOGIN-TOKEN", token, signedAt: Date.now().toString(), expiredAt: Date.now().toString() }];
        const saveUser = await CreateUser.save();
        console.log('User Created Successfully', saveUser);
        const redisKey = `otp:${saveUser._id}`
        const generateOTP = otpGenerator
        console.log("OPT Generated :", generateOTP);
        console.log("Redis Key:", redisKey);
        await redisClient.set(redisKey, generateOTP, 'EX', 60 * 15)
        const temp = await redisClient.get(redisKey)
        console.log("OTP from Redis:", temp);
        await sendMailService({ email: saveUser.email, username: saveUser.username, otp: generateOTP });

        return res.status(StatusCodes.CREATED).json({
            message: `User registered successfully. Please verify OTP sent to your email ${saveUser.email}`,
            UserName: saveUser.username, Email: saveUser.email,
            createAt: saveUser.createdAt, updatedAt: saveUser.updatedAt,
            isActive: saveUser.isActive,
            roles: saveUser.roles.map(role => role.name)
        })
    } catch (error) {
        console.error("Error in Create User Task:", error);
        const errorMessage = error.message || "An unknown error occurred";
        const errorDetails = error.errors || {};
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Error in Create User Task',
            error: { message: errorMessage, details: errorDetails }
        });
    }

}
// thêm xác thực otp lúc login 


export const loginHandler = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    if (!username && !email) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Username or Email is required' });
    }

    if (!password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Password is required' });
    }

    try {
        let userQuery = {};
        if (email) {
            userQuery.email = email
        } else if (username) {
            userQuery.username = username
        }
        console.log(userQuery);
        const foundUser = await user.findOne(userQuery).populate("roles");
        console.log(foundUser);

        if (!foundUser) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Username or Email' });
        }
        if (foundUser.isActive === false) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Login Failed , User is not active' });
        }

        const isPasswordValid = await user.comparePassword(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Password' });
        }

        // Xử lý cookies và tokens
        const newCookies = await getCookies(foundUser, res);
        console.log(newCookies.cookie)
        const token = await manageTokens(foundUser, newCookies, "LOGIN-TOKEN");

        return res.status(StatusCodes.OK).json({ message: 'Login Successful', token });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: err.message });
    }
};

// export const logoutHandler = async (req, res) => {
//     const token = req.cookies.token;
//     if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ message: '' })
//     try {
//         const userDecoded = jwt.verify(token, SECRET_KEY);
//         // await user.updateOne({
//         //     $pull: { tokens: { token: token } },
//         // });
//         const User = await user.findById(decoded.id, { password: 0 });
//         if (!User) return res.status(404).json({ message: "No user found" });
//         await User.findByIdAndUpdate(userDecoded.id, { tokens: [] });

//     } catch (error) {

//     }
// }
export const logoutHandler = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Token is missing. Unauthorized access." });
    }

    try {
        // Xác thực và giải mã token
        const userDecoded = jwt.verify(token, process.env.JWT_SECRET);

        // Tìm người dùng theo ID từ token
        const _user = await user.findById(userDecoded.id);

        if (!_user) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ message: "User not found." });
        }

        // Xóa token trong danh sách tokens của người dùng
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

export const refreshToken = async (req, res) => {
    const currentToken = req.cookies.token;
    if (!currentToken) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    try {
        const user = jwt.verify(currentToken, SECRET_KEY);
        const newToken = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1d' });
        res.cookie('token', newToken, { expires: new Date(Date.now() + 86400000), httpOnly: true, secure: true });
        return res.status(StatusCodes.OK).json({ message: 'Token refreshed successfully' });
    } catch (err) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: 'Invalid token', error: err.message });
    }
}

// export const manageTokens = async (user) => {
//     let tokensArray = user.tokens || []
//     console.log(tokensArray);
//     if (tokensArray.length) {
//         tokensArray = tokensArray.filter(token => {
//             const timeDiff = (Date.now() - parseInt(token.signedAt)) / 1000;
//             if (timeDiff < 86400) {
//                 return token;
//             }
//         });
//     }
//     await user.findByIdAndUpdate(user.id, {
//         tokens: [...tokensArray, { token, signedAt: Date.now().toString() }],
//     });
// }
export const manageTokens = async (_user, token, type) => {
    try {
        let tokensArray = _user.tokens || [];
        console.log("Existing Tokens:", tokensArray);

        if (tokensArray.length) {
            tokensArray = tokensArray.filter((tokenObj) => {
                const timeDiff = (Date.now() - parseInt(tokenObj.signedAt)) / 1000;
                return timeDiff < 86400;
            });
        }
        tokensArray.push({ type, token, signedAt: Date.now().toString(), expiredAt: (Date.now() + 86400000).toString() });
        await user.findByIdAndUpdate(_user._id, { tokens: tokensArray }, { new: true });
        console.log("Updated Tokens:", tokensArray);
    } catch (error) {
        console.error("Error managing tokens:", error);
        throw new Error("Unable to manage tokens");
    }
};

// export const getProfile = async (req, res) => {
//     console.log(req.cookies);
//     try {
//         const user_Cookies = req.cookies.token
//         if (!user_Cookies) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized - No token Provided' })

//         const decodedUser = jwt.verify(user_Cookies, SECRET_KEY)
//         console.log(decodedUser);
//         const userID_Decoded = decodedUser.id
//         // const foundUser = await user.findById(decoded.id).populate('roles', 'name');
//         const foundUser = await user.findOne({
//             $or: [
//                 { _id: userID_Decoded },  // Tìm theo _id nếu 'id' là ObjectId
//                 { id: userID_Decoded }    // Tìm theo 'id' nếu 'id' là chuỗi UUID
//             ]
//         }).populate('roles', 'name');
//         if (!foundUser) {
//             return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
//         }
//         const userProfile = {
//             username: foundUser.username,
//             email: foundUser.email,
//             roles: foundUser.roles.map((role) => role.name),
//             isActive: foundUser.isActive,
//             tokens: foundUser.tokens.length,
//             password: '**********',
//             createdAt: foundUser.createdAt,
//             updatedAt: foundUser.updatedAt,
//         };
//         return res.status(StatusCodes.OK).json({ message: 'User profile fetched successfully', userProfile });
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error', error: error.message });
//     }
// }
export const getProfile = async (req, res) => {
    console.log(req.cookies);

    try {
        const userToken = req.cookies.token;
        if (!userToken) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .json({ message: 'Unauthorized - No token provided' });
        }

        let decodedUser;
        try {
            decodedUser = jwt.verify(userToken, SECRET_KEY);
        } catch (err) {
            console.error("Invalid or expired token:", err.message);
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
        }

        const userID = decodedUser.id;
        const foundUser = await user.findOne({
            $or: [
                { _id: userID }, // Tìm bằng ObjectId
                { id: userID }   // Tìm bằng UUID
            ]
        }).populate('roles', 'name');

        if (!foundUser) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }

        // Kiểm tra token có tồn tại trong cơ sở dữ liệu
        const tokenExists = foundUser.tokens.some((tokenObj) => tokenObj.token === userToken);
        if (!tokenExists) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized - Token mismatch' });
        }

        // Tạo profile trả về
        const userProfile = {
            username: foundUser.username,
            email: foundUser.email, // Cân nhắc loại bỏ hoặc ẩn
            roles: foundUser.roles.map((role) => role.name),
            isActive: foundUser.isActive,
            tokens: foundUser.tokens.length,
            password: '**********', // Ẩn mật khẩu
            createdAt: foundUser.createdAt,
            updatedAt: foundUser.updatedAt,
        };

        return res.status(StatusCodes.OK).json({
            message: 'User profile fetched successfully',
            userProfile,
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


// export const verified_OTP = async (req, res) => {
//     const cookies = req.cookies.token
//     const otp = req.body.otp
//     if (!cookies) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Verify OTP failed, Unauthorized' })
//     if (!otp) return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Verify OTP failed, OTP is required' })
//     try {
//         const decodedUser = jwt.verify(cookies, SECRET_KEY)
//         const UserID = decodedUser.id
//         const redisFound = await redisClient.get(`otp:${UserID}`)

//         if (redisFound) {
//             const jsonParseUser = JSON.parse(redisFound)
//             if (jsonParseUser.otp === otp) {
//                 const userFound = await user.findById(UserID)
//                 userFound.isActive = true
//                 await userFound.save()
//                 await redisClient.del(`otp:${UserID}`);
//                 return res.status(StatusCodes.OK).json({ message: 'Verify OTP successful, User is activated' })
//             }
//             return res.status(StatusCodes.FORBIDDEN).json({ message: 'Verify OTP failed, Invalid OTP' })
//         } return res.status(StatusCodes.FORBIDDEN).json({ message: 'Verify OTP failed, OTP expired or invalid' });
//     } catch (err) {
//         console.error("Verify OTP Error:", error);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Verify OTP failed, Internal Server Error' });
//     }
// }
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

        const otp = otpGenerator

        await redisClient.set(`forgotpassword:${userFound.email}`, otp, 'EX', 60 * 15);

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
            subject: 'Password Reset Successful',
            text: `Hi ${userFound.username},\n\nYour password of Account ${userFound.email} has been successfully reset.\n\n
            Please check again, if the password change was not done by you, please go to the report a compromised account section at this link.
            \n\nThank you.`,
            html: `<p>Hi ${userFound.username},</p>
                <p>Your password for the account <b>${userFound.email}</b> has been successfully reset.</p>
                <p>If this password change was not done by you, please <a href="http://localhost:4000/api/auth/report/compromised?token=${token1}" target="_blank">click here</a> to report your account as compromised.</p>
                <p>Thank you.</p>
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
