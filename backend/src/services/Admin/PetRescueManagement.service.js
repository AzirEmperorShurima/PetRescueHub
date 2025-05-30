export async function aggregateRescueMissionHistory(req, res) {
    try {
        const data = await RescueMissionHistory.aggregate([
            {
                $facet: {
                    // Thống kê theo trạng thái
                    byStatus: [
                        {
                            $group: {
                                _id: "$status",
                                count: { $sum: 1 }
                            }
                        }
                    ],

                    // Số nhiệm vụ theo tháng
                    monthlyMissions: [
                        {
                            $match: {
                                createdAt: {
                                    $gte: new Date(new Date().getFullYear(), 0, 1)
                                }
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

                    // Số người tham gia trung bình
                    avgVolunteers: [
                        {
                            $project: {
                                selectedCount: { $size: "$selectedVolunteers" },
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                avgSelected: { $avg: "$selectedCount" }
                            }
                        }
                    ],

                    // Tỉ lệ timeout
                    timeoutRatio: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: 1 },
                                timeout: {
                                    $sum: {
                                        $cond: [{ $eq: ["$status", "timeout"] }, 1, 0]
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                ratio: {
                                    $cond: [
                                        { $eq: ["$total", 0] },
                                        0,
                                        { $divide: ["$timeout", "$total"] }
                                    ]
                                }
                            }
                        }
                    ],

                    // ⏱ Thời gian trung bình hoàn thành nhiệm vụ
                    averageCompletionTime: [
                        {
                            $match: {
                                status: "completed",
                                startedAt: { $exists: true },
                                endedAt: { $exists: true }
                            }
                        },
                        {
                            $project: {
                                durationMinutes: {
                                    $divide: [
                                        { $subtract: ["$endedAt", "$startedAt"] },
                                        1000 * 60 // Convert ms to minutes
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                avgMinutes: { $avg: "$durationMinutes" }
                            }
                        }
                    ]
                }
            }
        ]);

        const result = data[0];

        const monthLabels = result.monthlyMissions.map(e => {
            const m = e._id.month.toString().padStart(2, "0");
            return `${m}/${e._id.year}`;
        });

        res.json({
            statusStats: {
                labels: result.byStatus.map(s => s._id),
                data: result.byStatus.map(s => s.count)
            },
            monthlyStats: {
                labels: monthLabels,
                data: result.monthlyMissions.map(e => e.count)
            },
            avgVolunteersPerMission:
                result.avgVolunteers[0]?.avgSelected || 0,
            timeoutRatio:
                result.timeoutRatio[0]?.ratio || 0,
            averageCompletionTimeMinutes:
                result.averageCompletionTime[0]?.avgMinutes || 0
        });
    } catch (err) {
        res.status(500).json({ message: "Aggregate error", error: err.message });
    }
}

/**
 * Aggregate Rescue Mission Statistics
 */
export async function aggregateRescueMissions() {
    const data = await RescueMissionHistory.aggregate([
        {
            $facet: {
                byStatus: [
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }
                ],
                monthlyCount: [
                    {
                        $match: {
                            createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } // From Jan this year
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
                totalVolunteerInvolvement: [
                    {
                        $project: {
                            numSelected: { $size: "$selectedVolunteers" },
                            accepted: {
                                $cond: [{ $ifNull: ["$acceptedVolunteer", false] }, 1, 0]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalSelected: { $sum: "$numSelected" },
                            totalAccepted: { $sum: "$accepted" }
                        }
                    }
                ]
            }
        }
    ]);

    const result = data[0];

    const byMonthLabels = result.monthlyCount.map(e => {
        const m = e._id.month.toString().padStart(2, "0");
        return `${m}/${e._id.year}`;
    });

    return {
        statusDistribution: {
            labels: result.byStatus.map(s => s._id),
            data: result.byStatus.map(s => s.count)
        },
        missionsByMonth: {
            labels: byMonthLabels,
            data: result.monthlyCount.map(e => e.count)
        },
        volunteerStats: result.totalVolunteerInvolvement[0] || {
            totalSelected: 0,
            totalAccepted: 0
        }
    };
}
