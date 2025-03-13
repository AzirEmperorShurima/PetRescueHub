import { StatusCodes } from 'http-status-codes';
import * as AuthService from '../services/AuthService.js';
import { handleError } from '../utils/ErrorHandler.js';

export const Signup_Handler = async (req, res) => {
    try {
        const result = await AuthService.signup(req.body, res);
        res.status(StatusCodes.CREATED).json(result);
    } catch (error) {
        handleError(res, error, 'Failed to sign up');
    }
};

export const loginHandler = async (req, res) => {
    try {
        const result = await AuthService.login(req.body, res);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        handleError(res, error, 'Failed to login');
    }
};

export const logoutHandler = async (req, res) => {
    try {
        await AuthService.logout(req.cookies.token);
        res.clearCookie('token');
        res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
        handleError(res, error, 'Failed to logout');
    }
};

export const verified_OTP = async (req, res) => {
    try {
        const result = await AuthService.verifyOTP(req.cookies.token, req.body.otp);
        res.status(StatusCodes.OK).json(result);
    } catch (error) {
        handleError(res, error, 'OTP verification failed');
    }
};