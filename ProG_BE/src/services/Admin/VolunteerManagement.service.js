
import { avatarConfig } from "../../../config.js";
import user from "../../models/user.js";


export const getComprehensiveUserStatistics = async () => {
    const defaultAvatars = Object.values(avatarConfig.defaultAvatars);

    const pipeline = [
        {
            $facet: {
                // Tổng số người dùng
                totalUsers: [{ $count: "count" }],

                // Thống kê giới tính
                genderStats: [
                    {
                        $group: {
                            _id: "$gender",
                            count: { $sum: 1 }
                        }
                    }
                ],

                // Thống kê vai trò
                roleStats: [
                    { $unwind: "$roles" },
                    {
                        $group: {
                            _id: "$roles",
                            count: { $sum: 1 }
                        }
                    }
                ],

                // Email chưa xác minh
                emailUnverified: [
                    { $match: { emailVerified: false } },
                    { $project: { _id: 1, username: 1, email: 1 } }
                ],

                // Người dùng có nhiều số điện thoại
                multiplePhones: [
                    {
                        $match: {
                            phonenumber: { $exists: true },
                            $expr: { $gt: [{ $size: "$phonenumber" }, 1] }
                        }
                    },
                    { $project: { _id: 1, username: 1, fullname: 1, phonenumber: 1 } }
                ],

                // Người dùng dùng avatar mặc định
                usingDefaultAvatars: [
                    {
                        $match: {
                            $expr: { $in: ["$avatar", defaultAvatars] }
                        }
                    },
                    { $project: { _id: 1, username: 1, avatar: 1 } }
                ],

                // Người dùng mới (7 ngày gần đây)
                newUsers: [
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            }
                        }
                    },
                    { $project: { _id: 1, username: 1, createdAt: 1 } }
                ],

                // VIP Users
                vipUsers: [
                    { $match: { isVIP: true } },
                    { $project: { _id: 1, username: 1, fullname: 1 } }
                ],

                // Volunteer: Đã cứu trợ
                volunteerRescued: [
                    { $match: { volunteerStatus: "alreadyRescue" } },
                    { $project: { _id: 1, username: 1, fullname: 1, volunteerStatus: 1 } }
                ],

                // Volunteer: Chưa sẵn sàng
                volunteerNotReady: [
                    { $match: { volunteerStatus: "not ready" } },
                    { $project: { _id: 1, username: 1, fullname: 1, volunteerStatus: 1 } }
                ],

                // Volunteer: Đã gửi yêu cầu và đang chờ duyệt
                volunteerRequestsPending: [
                    { $match: { volunteerRequestStatus: "pending" } },
                    { $project: { _id: 1, username: 1, fullname: 1 } }
                ],

                // Volunteer: Không còn hoạt động (status không tồn tại hoặc khác các trạng thái trên)
                volunteerInactive: [
                    {
                        $match: {
                            roles: "volunteer",
                            $or: [
                                { volunteerStatus: { $exists: false } },
                                { volunteerStatus: { $nin: ["alreadyRescue", "not ready"] } }
                            ]
                        }
                    },
                    { $project: { _id: 1, username: 1, fullname: 1, volunteerStatus: 1 } }
                ],

                // Tài khoản bị rò rỉ
                compromisedAccounts: [
                    { $match: { isCompromised: true } },
                    { $project: { _id: 1, username: 1, fullname: 1 } }
                ]
            }
        },
        {
            $addFields: {
                totalUsers: { $arrayElemAt: ["$totalUsers.count", 0] },

                totalEmailUnverified: { $size: "$emailUnverified" },
                totalMultiplePhones: { $size: "$multiplePhones" },
                totalDefaultAvatars: { $size: "$usingDefaultAvatars" },
                totalNewUsers: { $size: "$newUsers" },
                totalVIP: { $size: "$vipUsers" },

                totalVolunteerRescued: { $size: "$volunteerRescued" },
                totalVolunteerNotReady: { $size: "$volunteerNotReady" },
                totalVolunteerPending: { $size: "$volunteerRequestsPending" },
                totalVolunteerInactive: { $size: "$volunteerInactive" },

                totalCompromised: { $size: "$compromisedAccounts" }
            }
        }
    ];

    const result = await user.aggregate(pipeline);
    return result[0];
};


export const getAdvancedVolunteerStatistics = async () => {
    const pipeline = [
        {
            $facet: {
                vipUsers: [
                    { $match: { isVIP: true } },
                    { $project: { username: 1, fullname: 1, email: 1, _id: 0 } }
                ],
                activeUsers: [
                    { $match: { isActive: true } },
                    { $project: { username: 1, fullname: 1, email: 1, _id: 0 } }
                ],
                volunteers: [
                    { $match: { volunteerStatus: { $in: ["alreadyRescue", "not ready"] } } },
                    { $project: { username: 1, fullname: 1, email: 1, volunteerStatus: 1, _id: 0 } }
                ],
                pendingVolunteers: [
                    { $match: { volunteerRequestStatus: "pending" } },
                    { $project: { username: 1, fullname: 1, email: 1, _id: 0 } }
                ],
                compromisedUsers: [
                    { $match: { isCompromised: true } },
                    { $project: { username: 1, fullname: 1, email: 1, _id: 0 } }
                ],
                newUsersLast7Days: [
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            }
                        }
                    },
                    { $project: { username: 1, fullname: 1, email: 1, createdAt: 1, _id: 0 } }
                ],
                usersWithDefaultAvatars: [
                    {
                        $match: {
                            $expr: {
                                $in: [
                                    "$avatar",
                                    [
                                        avatarConfig.defaultAvatars.male,
                                        avatarConfig.defaultAvatars.female,
                                        avatarConfig.defaultAvatars.neutral
                                    ]
                                ]
                            }
                        }
                    },
                    { $project: { username: 1, fullname: 1, avatar: 1, _id: 0 } }
                ],
                usersWithMultiplePhones: [
                    {
                        $match: {
                            $expr: { $gt: [{ $size: "$phonenumber" }, 1] }
                        }
                    },
                    { $project: { username: 1, fullname: 1, phonenumber: 1, _id: 0 } }
                ],
                emailUnverifiedUsers: [
                    { $match: { emailVerified: false } },
                    { $project: { username: 1, email: 1, _id: 0 } }
                ],
                genderDistribution: [
                    {
                        $group: {
                            _id: "$gender",
                            count: { $sum: 1 }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalVIP: { $size: "$vipUsers" },
                totalActive: { $size: "$activeUsers" },
                totalVolunteers: { $size: "$volunteers" },
                totalPendingVolunteerRequests: { $size: "$pendingVolunteers" },
                totalCompromised: { $size: "$compromisedUsers" },
                totalNewUsers7Days: { $size: "$newUsersLast7Days" },
                totalDefaultAvatars: { $size: "$usersWithDefaultAvatars" },
                totalMultiplePhones: { $size: "$usersWithMultiplePhones" },
                totalEmailUnverified: { $size: "$emailUnverifiedUsers" }
            }
        }
    ];

    const result = await user.aggregate(pipeline);
    return result[0];
};