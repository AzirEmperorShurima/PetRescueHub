import { StatusCodes } from "http-status-codes";
import { COOKIE_PATHS, TOKEN_TYPE } from "../../config.js";
import { getUserFieldFromToken } from "../services/User/User.service.js";
import User from "../models/user.js";
import { redisClient } from "../Config/redis.client.js";
import { resignVolunteerService } from "../services/Volunteer/Volunteer.service.js";

export const requestVolunteer = async (req, res) => {
    try {
        const userId = req.user._id;
        const userEmail = req.user.email;
        const roles = req.user.roles;
        const tokenType = req.token_verified.tokenType

        if (!userId || !userEmail || !roles || tokenType !== TOKEN_TYPE.ACCESS_TOKEN.name) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Access Denied You must be login to use this resource " });
        }
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: "User không tồn tại!" });

        if (user.volunteerRequestStatus === "pending") {
            return res.status(400).json({ message: "Bạn đã gửi yêu cầu trước đó, vui lòng chờ duyệt!" });
        }

        if (user.volunteerRequestStatus === "approved") {
            return res.status(400).json({ message: "Bạn đã được phê duyệt làm volunteer!" });
        }

        // Cập nhật trạng thái
        user.volunteerRequestStatus = "pending";
        await user.save();

        return res.status(200).json({ message: "Yêu cầu volunteer đã được gửi, vui lòng chờ duyệt!" });
    } catch (error) {
        console.error("Lỗi khi gửi yêu cầu volunteer:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!" });
    }
};

export const volunteerUpdateStatus = async (req, res) => {
    // Get JWT Verification and Authorization from Cookies
    const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
    if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Missing user ID in token" });
    }

    const userEmail = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'email');
    if (!userEmail) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Missing email in token" });
    }

    const roles = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'roles');
    if (!roles || !Array.isArray(roles)) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Invalid or missing roles in token" });
    }

    if (!roles.includes('volunteer')) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Access denied: User is not a volunteer" });
    }

    const tokenType = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, "tokenType");
    if (!tokenType || tokenType !== TOKEN_TYPE.ACCESS_TOKEN.name) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized: Invalid token type" });
    }

    const { volunteerStatus, longitude, latitude } = req.body;

    try {
        // Validate input
        if (!volunteerStatus) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "volunteerStatus is required" });
        }
        if (!['alreadyRescue', 'not ready'].includes(volunteerStatus)) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid volunteerStatus. Must be 'alreadyRescue', 'not ready'" });
        }
        if (volunteerStatus === 'alreadyRescue') {
            if (!longitude || !latitude) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "longitude and latitude are required for alreadyRescue status" });
            }
            if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
                return res.status(400).json({ error: 'Invalid coordinates' });
            }
        }

        const userFound = await User.findById(userId)
            .select('id username volunteerStatus roles')
            .populate('roles');
        if (!userFound) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
        }
        if (!userFound.roles.some(role => role.name.toLowerCase() === 'volunteer')) {
            return res.status(StatusCodes.FORBIDDEN).json({ error: "Access denied: User is not a volunteer in database" });
        }

        userFound.volunteerStatus = volunteerStatus;
        await userFound.save();

        if (userFound.volunteerStatus === 'alreadyRescue') {
            if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid coordinates" });
            }
            const result = await redisClient.sendCommand(['GEOADD', 'volunteers', longitude.toString(), latitude.toString(), userId.toString()]);
            console.log('Result of GEOADD:', result);
            if (!result) {
                console.error('GEOADD không thêm được vị trí cho userId:', userId);
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Không thể cập nhật vị trí trong Redis" });
            }
        } else {
            await redisClient.sendCommand(['ZREM', 'volunteers', userId.toString()]);
        }

        return res.status(StatusCodes.OK).json({
            message: "Volunteer status updated successfully",
            user: {
                id: userFound.id,
                username: userFound.username,
                volunteerStatus: userFound.volunteerStatus,
                location: {
                    longitude: longitude,
                    latitude: latitude
                }
            }
        });
    } catch (error) {
        console.error('Error updating volunteer status:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error" });
    }
};


/**
 * @desc Volunteer từ bỏ quyền volunteer của mình
 */
export const resignVolunteer = async (req, res) => {
    try {
        const userId = req.user._id;
        const userEmail = req.user.email;
        const roles = req.user.roles;
        const tokenType = req.token_verified.tokenType;

        if (!userId || !userEmail || !roles || tokenType !== TOKEN_TYPE.ACCESS_TOKEN.name) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ 
                message: "Unauthorized: Access Denied You must be login to use this resource" 
            });
        }

        const result = await resignVolunteerService(userId);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json({ 
            message: result.message,
            user: result.data
        });
    } catch (error) {
        console.error("Lỗi khi từ bỏ quyền volunteer:", error);
        return res.status(500).json({ message: "Lỗi máy chủ!", error: error.message });
    }
};

