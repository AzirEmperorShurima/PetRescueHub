// // import { StatusCodes } from "http-status-codes";
// // import { bloomConfig, redisClient } from "../Cache/User_Cache.js";
// // import defaultRole from "../models/Role.js";

// // export const Exist_User_Checking = async (req, res, next) => {
// //     const nameRequiredCheck = req.body.username;
// //     try {
// //         if (!bloomConfig.has(nameRequiredCheck)) {
// //             return res.status(StatusCodes.OK).json({ message: "Username Not Contains" })
// //         }
// //         redisClient.get(nameRequiredCheck, async (err, cachedResult) => {
// //             if (err) throw err;

// //             if (cachedResult) {
// //                 return res.status(200).json({ exists: JSON.parse(cachedResult) });
// //             }
// //             const user = await user.findOne({ username: nameRequiredCheck });
// //             const exists = !!user;
// //             redisClient.setEx(username, 3600, JSON.stringify(exists));
// //             if (exists) {
// //                 bloomConfig.add(nameRequiredCheck);
// //                 return res.status(StatusCodes.CONFLICT).json({ message: "Username already exists. Please choose a different one." });
// //             }

// //             next();

// //         })
// //     } catch (err) {
// //         console.error('Error checking username:', error);
// //         return res.status(500).json({ message: 'Internal Server Error' });
// //     }

// // }

// // export const Valid_Roles_Certification = (req, res, next) => {
// //     const roles = req.body.roles;

// //     if (!roles) {
// //         return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Roles Is Required - Must Provided' })
// //     }
// //     if (roles && typeof roles === 'object' && !Array.isArray(roles)) {
// //         req.body.roles = [roles];
// //     }
// //     const invalidRoles = roles.filter(role => !defaultRole.includes(role));
// //     if (invalidRoles.length > 0) {
// //         return res.status(StatusCodes.BAD_REQUEST).json({ message: `Roles '${invalidRoles.join(', ')}' are not supported.` });
// //     }

// // }
// import { StatusCodes } from "http-status-codes";
// import { bloomConfig, redisClient } from "../Cache/User_Cache.js";
// import defaultRole from "../models/Role.js";
// import User from "../models/user.js";
// import Role from "../models/Role.js";

// // export const Exist_User_Checking = async (req, res, next) => {
// //     const username = req.body.username;
// //     console.log(username);
// //     if (!username) {
// //         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is required" });
// //     }

// //     try {
// //         if (!bloomConfig.has(username)) {
// //             return res.status(StatusCodes.OK).json({ message: "Username Not Contains" });
// //         }

// //         redisClient.get(username, async (err, cachedResult) => {
// //             if (err) {
// //                 console.error("Redis error:", err);
// //                 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
// //             }

// //             if (cachedResult) {
// //                 return res.status(StatusCodes.OK).json({ exists: JSON.parse(cachedResult) });
// //             }

// //             const user = await User.findOne({ username });
// //             const exists = !!user;

// //             redisClient.setEx(username, 3600, JSON.stringify(exists));

// //             if (exists) {
// //                 bloomConfig.add(username);
// //                 return res.status(StatusCodes.CONFLICT).json({
// //                     message: "Username already exists. Please choose a different one.",
// //                 });
// //             }

// //             next();
// //         });
// //     } catch (err) {
// //         console.error("Error checking username:", err);
// //         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
// //     }
// // };
// export const Exist_User_Checking = async (req, res, next) => {
//     const { username } = req.body;

//     if (!username) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is required" });
//     }

//     try {
//         // Kiểm tra nhanh trong Bloom Filter
//         if (!bloomConfig.has(username)) {
//             // Trường hợp đăng ký (signup) cho phép tiếp tục nếu username không tồn tại
//             if (req.path === "/signup") {
//                 return next();
//             }
//             // Các trường hợp khác trả về kết quả không tồn tại
//             return res.status(StatusCodes.OK).json({ message: "Username does not exist in the system" });
//         }

//         // Kiểm tra trong Redis
//         redisClient.get(username, async (err, cachedResult) => {
//             if (err) {
//                 console.error("Redis error:", err);
//                 return res
//                     .status(StatusCodes.INTERNAL_SERVER_ERROR)
//                     .json({ message: "An error occurred while checking username in Redis" });
//             }

//             if (cachedResult) {
//                 const exists = JSON.parse(cachedResult);
//                 if (exists && req.path === "/signup") {
//                     return res.status(StatusCodes.CONFLICT).json({
//                         message: "Username already exists. Please choose a different one.",
//                     });
//                 }
//                 return res.status(StatusCodes.OK).json({ exists });
//             }

//             // Kiểm tra trong MongoDB
//             try {
//                 const user = await User.findOne({ username });
//                 const exists = !!user;

//                 // Cập nhật Redis và Bloom Filter
//                 redisClient.setEx(username, 3600, JSON.stringify(exists));
//                 if (exists) {
//                     bloomConfig.add(username);
//                     if (req.path === "/signup") {
//                         return res.status(StatusCodes.CONFLICT).json({
//                             message: "Username already exists. Please choose a different one.",
//                         });
//                     }
//                     return res.status(StatusCodes.OK).json({ exists });
//                 }

//                 // Nếu username không tồn tại và là đăng ký, tiếp tục xử lý
//                 next();
//             } catch (dbError) {
//                 console.error("MongoDB error:", dbError);
//                 return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error querying the database" });
//             }
//         });
//     } catch (err) {
//         console.error("Error in Exist_User_Checking middleware:", err);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
//     }
// };


// export const Valid_Roles_Certification = async (req, res, next) => {
//     let roles = req.body.roles;

//     if (!roles) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Roles are required" });
//     }

//     if (typeof roles === "string") {
//         roles = [roles];
//     }

//     if (!Array.isArray(roles)) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Roles must be an array" });
//     }

//     // const invalidRoles = roles.filter((role) => !defaultRole.includes(role));
//     const validRoles = (await Role.find({})).map((role) => role.name);
//     const invalidRoles = roles.filter((role) => !validRoles.includes(role));
//     if (invalidRoles.length > 0) {
//         return res
//             .status(StatusCodes.BAD_REQUEST)
//             .json({ message: `Roles '${invalidRoles.join(", ")}' are not supported.` });
//     }

//     req.body.roles = roles;
//     next();
// };
import { StatusCodes } from "http-status-codes";
import { redisClient } from "../Config/redis.client.js";
import User from "../models/user.js";
import Role from "../models/Role.js";

// export const Exist_User_Checking = async (req, res, next) => {
//     const { username, email } = req.body;

//     if (!username) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is required" });
//     }
//     if (!email) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: "email is required" });
//     }

//     try {
//         // Kiểm tra Redis
//         const cachedResult = await redisClient.get(username);
//         const emailDetect = await redisClient.get(email);
//         if (cachedResult) {
//             const exists = JSON.parse(cachedResult);
//             if (exists && req.path === "/signup") {
//                 return res.status(StatusCodes.CONFLICT).json({
//                     message: "Username already exists cahe. Please choose a different one.",
//                 });
//             }
//             // return res.status(StatusCodes.OK).json({ exists });
//         }
//         if (emailDetect) {
//             const exists = JSON.parse(emailDetect);
//             if (exists && req.path === "/signup") {
//                 return res.status(StatusCodes.CONFLICT).json({
//                     message: "Email already exists cahe. Please choose a different one.",
//                 });
//             }
//             // return res.status(StatusCodes.OK).json({ exists });
//         }

//         // Kiểm tra MongoDB
//         const user = await User.findOne({ $or: [{ username }, { email }] });
//         const exists = user;

//         if (exists) {
//             await redisClient.setEx(user.username, 3600, JSON.stringify(exists));
//             if (req.path === "/signup") {
//                 return res.status(StatusCodes.CONFLICT).json({
//                     message: "Username already exists. Please choose a different one.",
//                 });
//             }
//             return res.status(StatusCodes.OK).json({ exists });
//         }
//         next();
//     } catch (err) {
//         console.error("Error in Exist_User_Checking middleware:", err);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
//     }
// };
// export const Exist_User_Checking = async (req, res, next) => {
//     const { username, email } = req.body;

//     // Kiểm tra yêu cầu username và email
//     if (!username) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is required" });
//     }
//     if (!email) {
//         return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is required" });
//     }

//     try {
//         // Kiểm tra Redis trước
//         const cachedUsername = await redisClient.get(username);
//         const cachedEmail = await redisClient.get(email);

//         if (cachedUsername) {
//             const exists = JSON.parse(cachedUsername);
//             if (exists && req.path === "/signup") {
//                 return res.status(StatusCodes.CONFLICT).json({
//                     message: `Username ${exists} already exists in cache. Please choose a different one.`,
//                 });
//             }
//         }

//         if (cachedEmail) {
//             const exists = JSON.parse(cachedEmail);
//             if (exists && req.path === "/signup") {
//                 return res.status(StatusCodes.CONFLICT).json({
//                     message: `Email ${exists} already exists in cache. Please choose a different one.`,
//                 });
//             }
//         }


//         const user = await User.findOne({ $or: [{ username }, { email }] });

//         if (user) {
//             // Lưu vào Redis nếu tìm thấy
//             try {
//                 await redisClient.setEx(user.username, 3600, JSON.stringify(user));
//                 await redisClient.setEx(user.email, 3600, JSON.stringify(user));
//             } catch (cacheError) {
//                 console.error("Redis caching error:", cacheError);
//             }
//             if (req.path === "/signup") {
//                 return res.status(StatusCodes.CONFLICT).json({
//                     message: "Username or email already exists. Please choose a different one.",
//                 });
//             }
//             return res.status(StatusCodes.OK).json({ user });
//         }

//         // Tiến hành tiếp nếu không có lỗi
//         next();
//     } catch (err) {
//         console.error("Error in Exist_User_Checking middleware:", err);
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
//     }
// };
export const Exist_User_Checking = async (req, res, next) => {
    const { username, email } = req.body;

    if (!username) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Username is required" });
    }
    if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email is required" });
    }

    try {
        // Kiểm tra Redis trước
        console.log("🔍 Checking cache for username and email...");
        const [cachedUsername, cachedEmail] = await Promise.all([
            redisClient.get(username),
            redisClient.get(email),
        ]);

        if (cachedUsername || cachedEmail) {
            console.log("✅ Found in cache");
            return res.status(StatusCodes.CONFLICT).json({
                message: "Username or email already exists in cache. Please choose a different one.",
            });
        }

        // Nếu Redis không có, truy vấn MongoDB
        console.log("⚠️ Cache miss! Fetching from MongoDB...");
        const user = await User.findOne({ $or: [{ username }, { email }] });

        if (user) {
            console.log("✅ Found in MongoDB. Caching in Redis...");
            try {
                // await redisClient.multi()
                //     .setEx(user.username, 3600, JSON.stringify(user))
                //     .setEx(user.email, 3600, JSON.stringify(user))
                //     .exec();
                await redisClient.multi()
                    .setEx(user.username, 3600, "true")
                    .setEx(user.email, 3600, "true")
                    .exec();
                console.log("🔄 Cached in Redis successfully!");
            } catch (cacheError) {
                console.error("❌ Redis caching error:", cacheError);
            }

            return res.status(StatusCodes.CONFLICT).json({
                message: "Username or email already exists. Please choose a different one.",
            });
        }

        console.log("✅ No existing user found. Proceeding to next middleware...");
        next();
    } catch (err) {
        console.error("❌ Error in Exist_User_Checking middleware:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Internal server error",
        });
    }
};


export const Valid_Roles_Certification = async (req, res, next) => {
    let { roles } = req.body;

    if (!roles) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Roles are required" });
    }

    if (typeof roles === "string") {
        roles = [roles];
    }

    if (!Array.isArray(roles)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Roles must be an array" });
    }

    try {
        const validRoles = (await Role.find({})).map((role) => role.name);
        const invalidRoles = roles.filter((role) => !validRoles.includes(role));

        if (invalidRoles.length > 0) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: `Roles '${invalidRoles.join(", ")}' are not supported.` });
        }

        req.body.roles = roles;
        next();
    } catch (err) {
        console.error("Error in Valid_Roles_Certification middleware:", err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
};
