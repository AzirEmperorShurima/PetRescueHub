import PetProfile from '../../models/PetProfile.js';
import { StatusCodes } from 'http-status-codes';

export const getAllPetStatistics = async (req, res) => {
    try {
        const stats = await PetProfile.aggregate([
            {
                $facet: {
                    totalPets: [{ $count: 'count' }],

                    byGender: [
                        {
                            $group: {
                                _id: '$gender',
                                count: { $sum: 1 },
                            }
                        }
                    ],

                    byReproductiveStatus: [
                        {
                            $group: {
                                _id: '$reproductiveStatus',
                                count: { $sum: 1 }
                            }
                        }
                    ],

                    averageAge: [
                        {
                            $group: {
                                _id: null,
                                averageAge: { $avg: '$age' }
                            }
                        }
                    ],

                    byPetState: [
                        {
                            $group: {
                                _id: '$petState',
                                count: { $sum: 1 }
                            }
                        }
                    ],

                    topBreeds: [
                        {
                            $group: {
                                _id: '$breedName',
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                    ],

                    userStatistics: [
                        {
                            $group: {
                                _id: '$ownerId',
                                totalPets: { $sum: 1 },
                                male: {
                                    $sum: {
                                        $cond: [{ $eq: ['$gender', 'male'] }, 1, 0]
                                    }
                                },
                                female: {
                                    $sum: {
                                        $cond: [{ $eq: ['$gender', 'female'] }, 1, 0]
                                    }
                                },
                                neutered: {
                                    $sum: {
                                        $cond: [{ $eq: ['$reproductiveStatus', 'neutered'] }, 1, 0]
                                    }
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: '_id',
                                foreignField: '_id',
                                as: 'owner'
                            }
                        },
                        {
                            $unwind: '$owner'
                        },
                        {
                            $project: {
                                _id: 0,
                                userId: '$owner._id',
                                name: '$owner.name',
                                email: '$owner.email',
                                totalPets: 1,
                                male: 1,
                                female: 1,
                                neutered: 1
                            }
                        },
                        { $sort: { totalPets: -1 } }
                    ]
                }
            }
        ]);

        // Lấy kết quả từ facet
        const result = stats[0];

        return res.status(StatusCodes.OK).json({
            message: 'Thống kê toàn bộ thú cưng thành công!',
            statistics: {
                totalPets: result.totalPets[0]?.count || 0,
                byGender: formatArrayToObject(result.byGender),
                byReproductiveStatus: formatArrayToObject(result.byReproductiveStatus),
                averageAge: result.averageAge[0]?.averageAge?.toFixed(1) || 0,
                byPetState: formatArrayToObject(result.byPetState),
                topBreeds: result.topBreeds,
                userStatistics: result.userStatistics,
            }
        });
    } catch (error) {
        console.error('Aggregation error:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

// Helper: chuyển từ array về object
const formatArrayToObject = (arr) => {
    return arr.reduce((obj, item) => {
        obj[item._id || 'unknown'] = item.count;
        return obj;
    }, {});
};
