import user from "../../models/user.js";

export async function aggregateUserChartData() {
    const now = new Date();
    const lastYear = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const data = await user.aggregate([
        {
            $lookup: {
                from: "roles",
                localField: "roles",
                foreignField: "_id",
                as: "roles"
            }
        },
        {
            $addFields: {
                roleNames: {
                    $map: {
                        input: "$roles",
                        as: "role",
                        in: "$$role.name"
                    }
                }
            }
        },
        {
            $facet: {
                byMonth: [
                    {
                        $match: {
                            createdAt: { $gte: lastYear }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } }
                ],
                byRole: [
                    { $unwind: "$roleNames" },
                    {
                        $group: {
                            _id: "$roleNames",
                            count: { $sum: 1 }
                        }
                    }
                ],
                byGender: [
                    {
                        $group: {
                            _id: "$gender",
                            count: { $sum: 1 }
                        }
                    }
                ],
                byStatus: [
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }
                ]
            }
        }
    ]);

    const result = data[0];

    const formatPieData = (arr) => ({
        labels: arr.map(e => e._id || "unknown"),
        data: arr.map(e => e.count)
    });

    const byMonthLabels = result.byMonth.map(e => {
        const m = e._id.month.toString().padStart(2, "0");
        return `${m}/${e._id.year}`;
    });

    return {
        byMonth: {
            labels: byMonthLabels,
            data: result.byMonth.map(e => e.count)
        },
        byRole: formatPieData(result.byRole),
        byGender: formatPieData(result.byGender),
        byStatus: formatPieData(result.byStatus)
    };
}


export async function getUserStatistics() {
    const now = new Date();
    const lastYear = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const stats = await User.aggregate([
        {
            $lookup: {
                from: "roles",
                localField: "roles",
                foreignField: "_id",
                as: "roles"
            }
        },
        {
            $addFields: {
                roleNames: {
                    $map: {
                        input: "$roles",
                        as: "role",
                        in: "$$role.name"
                    }
                }
            }
        },
        {
            $facet: {
                total: [{ $count: "totalUsers" }],
                byRole: [
                    { $unwind: "$roleNames" },
                    {
                        $group: {
                            _id: "$roleNames",
                            count: { $sum: 1 }
                        }
                    }
                ],
                byStatus: [
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }
                ],
                byGender: [
                    {
                        $group: {
                            _id: "$gender",
                            count: { $sum: 1 }
                        }
                    }
                ],
                byMonth: [
                    {
                        $match: {
                            createdAt: { $gte: lastYear }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: "$createdAt" },
                                month: { $month: "$createdAt" }
                            },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { "_id.year": 1, "_id.month": 1 }
                    }
                ]
            }
        }
    ]);

    const result = stats[0];
    const normalize = (arr, labelKey = "_id") =>
        Object.fromEntries(arr.map(item => [item[labelKey] ?? "unknown", item.count]));

    return {
        total: result.total[0]?.totalUsers || 0,
        byRole: normalize(result.byRole),
        byStatus: normalize(result.byStatus),
        byGender: normalize(result.byGender),
        byMonth: result.byMonth.map(item => ({
            month: `${item._id.month}/${item._id.year}`,
            count: item.count
        }))
    };
}
