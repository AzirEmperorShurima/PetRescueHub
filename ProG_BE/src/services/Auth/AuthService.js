import userModel from '../models/user.js';
import Role from '../models/Role.js';
import { otpGenerator } from './Otp/createOTP.js';
import { redisClient } from '../Cache/User_Cache.js';
import { getCookies } from '../middlewares/Cookies.js';
import { verifyToken } from '../utils/AuthUtils.js';
import { sendMailService } from './sendMailService/nodeMailer.js';

export const signup = async ({ username, password, email }, res) => {
    if (!username || !password || !email) throw new Error('Missing required fields');

    const role = await Role.findOne({ name: 'user' });
    if (!role) throw new Error("Role 'user' not found");

    const newUser = new userModel({ username, password, email, roles: [role._id] });
    const token = await getCookies(newUser, res);

    newUser.tokens = [{ type: 'LOGIN-TOKEN', token, signedAt: Date.now().toString(), expiredAt: Date.now().toString() }];
    await newUser.save();

    const otp = otpGenerator;
    await redisClient.set(`otp:${newUser._id}`, otp, 'EX', 900);
    await sendMailService({ email, username, otp });

    return { message: `User registered. Verify OTP sent to ${email}`, username, email, roles: ['user'] };
};

export const login = async ({ username, password, email }, res) => {
    if ((!username && !email) || !password) throw new Error('Missing credentials');

    const query = email ? { email } : { username };
    const foundUser = await userModel.findOne(query).populate('roles');

    if (!foundUser || !foundUser.isActive) throw new Error('Invalid credentials or inactive account');

    const isValidPassword = await userModel.comparePassword(password, foundUser.password);
    if (!isValidPassword) throw new Error('Invalid password');

    const token = await getCookies(foundUser, res);
    await manageTokens(foundUser, token, 'LOGIN-TOKEN');

    return { message: 'Login Successful', token };
};

export const logout = async (token) => {
    if (!token) throw new Error('Token is required');
    const { id } = verifyToken(token);

    const foundUser = await userModel.findById(id);
    if (!foundUser) throw new Error('User not found');

    foundUser.tokens = foundUser.tokens.filter(t => t.token !== token);
    await foundUser.save();
};

export const verifyOTP = async (token, otp) => {
    if (!token || !otp) throw new Error('Token and OTP are required');

    const { id } = verifyToken(token);
    const storedOtp = await redisClient.get(`otp:${id}`);
    if (storedOtp !== otp) throw new Error('Invalid OTP');

    await userModel.findByIdAndUpdate(id, { isActive: true });
    await redisClient.del(`otp:${id}`);

    return { message: 'OTP verified successfully' };
};

const manageTokens = async (user, token, type) => {
    user.tokens = (user.tokens || []).filter(t => (Date.now() - parseInt(t.signedAt)) < 86400000);
    user.tokens.push({ type, token, signedAt: Date.now().toString(), expiredAt: (Date.now() + 86400000).toString() });
    await user.save();
};