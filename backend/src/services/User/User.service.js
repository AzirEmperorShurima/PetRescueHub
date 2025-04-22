export const authenticateUser = (req) => {
    const userCookies = req.cookies.token;
    if (!userCookies) throw new Error("Unauthorized - No token provided");

    try {
        return jwt.verify(userCookies, SECRET_KEY);
    } catch (err) {
        throw new Error("Invalid or expired token");
    }
};
/**
* Lấy ID người dùng từ cookie
* @param {Object} req - Đối tượng yêu cầu
* @returns {String} - ID người dùng
*/
export const getUserIdFromCookies = (req) => {
    const decodedUser = authenticateUser(req);
    return decodedUser.id;
}