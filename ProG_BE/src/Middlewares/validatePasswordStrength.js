export const validatePasswordStrength = (req, res, next) => {
    const passwordsToCheck = [
        req.body.password,
        req.body.newPassword,
        req.body.confirmPassword
    ].filter(Boolean); // loại bỏ undefined/null

    if (passwordsToCheck.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Password is required",
        });
    }

    const isValid = (password) => {
        const minLength = 8;
        return (
            password.length >= minLength &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(password)
        );
    };

    for (const pwd of passwordsToCheck) {
        if (!isValid(pwd)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
            });
        }
    }

    next();
};
