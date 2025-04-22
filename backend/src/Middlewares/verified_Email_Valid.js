import pkg from 'validator';
const { isEmail } = pkg;

export const verified_Is_Email_Valid = (req, res, next) => {
    const email  = req.body.email
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }
    if (!isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }
    next();
}