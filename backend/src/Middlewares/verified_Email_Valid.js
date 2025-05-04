import pkg from 'validator';
const { isEmail } = pkg;

export const verified_Is_Email_Valid = (req, res, next) => {
    const email  = req.body.email
    if (!email) {
        console.log("Email is required");
        return res.status(400).json({ error: "Email is required." });
    }
    if (!isEmail(email)) {
        console.log("invalid email format");
        return res.status(400).json({ error: "Invalid email format." });
    }
    next();
}