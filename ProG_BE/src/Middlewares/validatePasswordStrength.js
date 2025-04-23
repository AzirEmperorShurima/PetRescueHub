// middlewares/validatePasswordStrength.js

import { StatusCodes } from "http-status-codes";

export const validatePasswordStrength = (req, res, next) => {
    const { password1 } = req.body;

    if (!password1) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Password is required",
        });
    }

    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password1);
    const hasLowerCase = /[a-z]/.test(password1);
    const hasNumber = /[0-9]/.test(password1);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password1);

    if (
        password1.length < minLength ||
        !hasUpperCase ||
        !hasLowerCase ||
        !hasNumber ||
        !hasSpecialChar
    ) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
        });
    }

    next();
};
