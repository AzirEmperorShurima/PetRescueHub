import { StatusCodes } from "http-status-codes";
import * as petService from "../services/Pet/Pet.service.js";
import PetProfile from "../models/PetProfile.js";
import Joi from "joi";

const petUpdateSchema = Joi.object({
    name: Joi.string().trim(),
    age: Joi.number().min(0),
    petDob: Joi.date(),
    breed: Joi.string().trim(),
    breedName: Joi.string().trim(),
    gender: Joi.string().valid('male', 'female', 'unknown'),
    petDetails: Joi.string(),
    weight: Joi.number().min(0),
    height: Joi.number().min(0),
    reproductiveStatus: Joi.string().valid('neutered', 'not neutered'),
    vaccinationStatus: Joi.array().items(
        Joi.object({
            vaccineName: Joi.string().required(),
            vaccinationDate: Joi.date(),
            vaccinationCode: Joi.string()
        })
    ),
    avatar: Joi.string(),
    microchipId: Joi.string(),
    petAlbum: Joi.array().items(Joi.string())
});


const checkOwnership = async (petId, ownerId) => {
    const pet = await petService.getPetOrThrow(petId);
    if (pet.ownerId.toString() !== ownerId) {
        throw new Error("Bạn không có quyền thực hiện hành động này!");
    }
    return pet;
};

/**
 * 🆕 Tạo thú cưng mới
 */
export const createPet = async (req, res) => {
    try {
        const ownerId = req.user._id;
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Bạn cần đăng nhập để thực hiện hành động này"
            });
        }

        const { error, value } = petUpdateSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Dữ liệu không hợp lệ",
                details: error.details.map((d) => d.message)
            });
        }

        if (value.microchipId) {
            const existingPet = await petService.findPetByMicrochipId(value.microchipId);
            if (existingPet) {
                return res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    message: "Microchip ID đã tồn tại trong hệ thống"
                });
            }
        }

        const petData = {
            ...value,
            avatar: req.avatarUrl || null,
            petAlbum: req.uploadedImageUrls || []
        };

        const newPet = await petService.createPetProfile(ownerId, petData);
        return res.status(201).json({
            success: true,
            message: "Thêm thú cưng thành công!",
            pet: newPet
        });
    } catch (error) {
        console.error("Lỗi khi tạo thú cưng:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Có lỗi xảy ra khi tạo hồ sơ thú cưng",
            error: error.message
        });
    }
};

/**
 * 🔄 
 */
/**
 * 📥 Upload avatar thú cưng
 */
export const uploadPetAvatar = async (req, res) => {
    try {
        const { petId, avatarUrl } = req.body
        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        await checkOwnership(petId, ownerId);
        const updatedPet = await petService.updatePetAvatar(petId, avatarUrl);
        res.status(200).json({ message: "Cập nhật avatar thành công!", avatar: updatedPet.avatar });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 📂 Upload giấy chứng nhận
 */
export const uploadPetCertificate = async (req, res) => {
    try {
        const { petId, certificateName, certificateType } = req.body;
        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        const certificateUrl = req.file?.path;
        if (!certificateUrl) throw new Error("Không có file được upload!");

        await checkOwnership(petId, ownerId); // Kiểm tra quyền
        const certificateData = { name: certificateName, type: certificateType, url: certificateUrl };
        const updatedPet = await petService.uploadPetCertificate(petId, certificateData);

        return res.status(200).json({ message: "Upload giấy chứng nhận thành công!", pet: updatedPet });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 📑 Cập nhật thông tin thú cưng
 */
export const updatePetProfile = async (req, res) => {
    try {
        const { petId } = req.params;
        if (!petId) return res.status(400).json({
            success: false,
            message: "Thiếu ID thú cưng!"
        });

        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Bạn cần đăng nhập để thực hiện hành động này"
            });
        }

        await checkOwnership(petId, ownerId);

        // Validate req.body using Joi
        const { error, value } = petUpdateSchema.validate(req.body, {
            allowUnknown: false,
            stripUnknown: true
        });

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        const petUpdateData = value;

        const updatedPet = await petService.updatePetProfile(petId, petUpdateData);
        if (!updatedPet) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thú cưng!"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin thành công!",
            pet: updatedPet
        });
    } catch (error) {
        console.error("Lỗi cập nhật thông tin thú cưng:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi hệ thống!",
            error: error.message
        });
    }
};
/**
 * 🗑 Xóa thú cưng
 */
export const deletePet = async (req, res) => {
    try {
        const { petId } = req.body;
        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        await checkOwnership(petId, ownerId); // Kiểm tra quyền
        const deletePet = await petService.deletePet(petId);
        if (!deletePet) return res.status(404).json({ message: "Không tìm thấy thú cưng!" });
        return res.status(200).json({ message: "Xóa thú cưng thành công!", pet: deletePet });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 🔍 Lấy danh sách thú cưng theo chủ sở hữu
 */
export const getPetsByOwner = async (req, res) => {
    try {
        const ownerId = req.params.ownerId || req.user?._id;
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Bạn cần đăng nhập để thực hiện hành động này"
            });
        }
         if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "ID chủ sở hữu không hợp lệ"
            });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await petService.getPetsByOwnerWithFilter(ownerId, req.query, page, limit);

        return res.status(StatusCodes.OK).json({
            message: "Lọc thú cưng thành công!",
            ...result
        });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Lỗi hệ thống",
            error: error.message
        });
    }
};

/**
 * 🔍 Lấy thông tin chi tiết một thú cưng
 */
export const getPetDetails = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = req.user._id
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        const isOwner = await checkOwnership(petId, userId);
        const pet = await petService.getPetOrThrow(petId);
        return res.status(200).json({
            message: "Get Pet Portfolio Successfully", petData: pet, canEdit: isOwner
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 💉 Thêm bản ghi tiêm phòng
 */
export const addVaccinationRecord = async (req, res) => {
    try {
        const { petId, vaccineName, vaccinationDate, vaccinationCode } = req.body;
        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        await checkOwnership(petId, ownerId);
        const vaccinationData = {
            vaccineName,
            vaccinationDate: vaccinationDate || new Date(),
            vaccinationCode: vaccinationCode || null
        };

        const updatedPet = await petService.addVaccinationRecord(petId, vaccinationData);
        return res.status(200).json({
            message: "Thêm bản ghi tiêm phòng thành công!",
            pet: updatedPet
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 📸 Thêm ảnh vào album thú cưng
 */
export const addPetAlbumPhoto = async (req, res) => {
    try {
        const { petId, photoUrl } = req.body;
        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        if (!photoUrl) throw new Error("Vui lòng cung cấp URL ảnh!");

        await checkOwnership(petId, ownerId);
        const updatedPet = await petService.addPhotoToAlbum(petId, photoUrl);
        return res.status(200).json({
            message: "Thêm ảnh vào album thành công!",
            pet: updatedPet
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 🗑 Xóa ảnh khỏi album thú cưng
 */
export const removePhotoFromPetAlbum = async (req, res) => {
    try {
        const { petId, photoUrl } = req.body;
        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        await checkOwnership(petId, ownerId);
        const updatedPet = await petService.removePhotoFromAlbum(petId, photoUrl);
        return res.status(200).json({ message: "Ảnh đã được xóa khỏi album!", pet: updatedPet });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 📝 Cập nhật microchip ID
 */
export const updateMicrochipId = async (req, res) => {
    try {
        const { petId, microchipId } = req.body;
        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        if (!microchipId) throw new Error("Vui lòng cung cấp microchip ID!");

        await checkOwnership(petId, ownerId);
        const updatedPet = await petService.updateMicrochipId(petId, microchipId);
        return res.status(200).json({
            message: "Cập nhật microchip ID thành công!",
            pet: updatedPet
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 🗑 Xóa giấy chứng nhận
 */
export const deletePetCertificate = async (req, res) => {
    try {
        const { petId, certificateId } = req.body;
        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        if (!certificateId) throw new Error("Vui lòng cung cấp ID giấy chứng nhận!");

        await checkOwnership(petId, ownerId);
        const updatedPet = await petService.deletePetCertificate(petId, certificateId);
        return res.status(200).json({
            message: "Xóa giấy chứng nhận thành công!",
            pet: updatedPet
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 📊 Lấy thống kê thú cưng của người dùng
 */
export const getPetStatistics = async (req, res) => {
    try {
        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        const pets = await petService.getPetsByOwner(ownerId);
        const stats = {
            totalPets: pets.length,
            byGender: {
                male: pets.filter(p => p.gender === "male").length,
                female: pets.filter(p => p.gender === "female").length,
                unknown: pets.filter(p => p.gender === "unknown").length
            },
            byReproductiveStatus: {
                neutered: pets.filter(p => p.reproductiveStatus === "neutered").length,
                notNeutered: pets.filter(p => p.reproductiveStatus === "not neutered").length
            },
            averageAge: pets.length > 0
                ? (pets.reduce((sum, pet) => sum + pet.age, 0) / pets.length).toFixed(1)
                : 0
        };

        return res.status(200).json({
            message: "Lấy thống kê thành công!",
            statistics: stats
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


/**
 * 🔍 Tìm kiếm thú cưng theo tiêu chí
 */
export const searchPets = async (req, res) => {
    try {
        const ownerId = req.user?._id;
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        const {
            breed,
            gender,
            minAge,
            maxAge,
            reproductiveStatus,
            breedName,
            search,
            petState,
            page = 1,
            limit = 10,
            sortBy = "createdAt",
            order = "desc"
        } = req.query;

        // Xây dựng searchCriteria
        const searchCriteria = {
            ownerId,
            ...(breed && { breed }),
            ...(gender && { gender }),
            ...(reproductiveStatus && { reproductiveStatus }),
            ...(breedName && { breedName: { $regex: breedName, $options: 'i' } }),
            ...(petState && { petState }),
            ...(search && {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { breed: { $regex: search, $options: 'i' } },
                    { breedName: { $regex: search, $options: 'i' } },
                ]
            }),
            isDeleted: false,
        };

        // Tuổi
        if (minAge || maxAge) {
            searchCriteria.age = {};
            if (minAge) searchCriteria.age.$gte = Number(minAge);
            if (maxAge) searchCriteria.age.$lte = Number(maxAge);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sort = { [sortBy]: order === "asc" ? 1 : -1 };

        const [pets, total] = await petService.searchPets(searchCriteria, { skip, limit: parseInt(limit), sort });

        return res.status(StatusCodes.OK).json({
            message: "Tìm kiếm thành công!",
            pets,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

export const petFilters = async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "Bạn cần đăng nhập để thực hiện hành động này",
        });
    }

    try {
        const {
            breed,
            breedName,
            gender,
            age,
            ageMin,
            ageMax,
            reproductiveStatus,
            petState,
            vaccineName,
            ownerId,
            page = 1,
            limit = 10
        } = req.query;

        const filter = {
            isDeleted: false,
            ...(petState ? { petState } : { petState: "ReadyToAdopt" }) 
        };

        if (breed) {
            filter.breed = { $in: breed.split(',') };
        }

        if (breedName) {
            filter.breedName = { $regex: breedName, $options: 'i' };
        }

        if (gender) {
            const genders = gender.split(',');
            filter.gender = { $in: genders };
        }

        if (reproductiveStatus) {
            filter.reproductiveStatus = reproductiveStatus;
        }

        if (ownerId) {
            filter.ownerId = ownerId;
        }

        if (vaccineName) {
            filter["vaccinationStatus.vaccineName"] = { $regex: vaccineName, $options: 'i' };
        }

        if (age) {
            filter.age = Number(age);
        }

        if (ageMin || ageMax) {
            filter.age = filter.age || {};
            if (ageMin) filter.age.$gte = parseInt(ageMin);
            if (ageMax) filter.age.$lte = parseInt(ageMax);
        }

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        const pets = await petService.filterPetProfiles(filter, skip, limitNum);

        return res.status(200).json({
            message: "Lọc thú cưng thành công!",
            ...pets,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi hệ thống!",
            error: error.message,
        });
    }
};



export const getAllPets = async (req, res) => {
    const userId = req.user._id
    if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
    }
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const pets = await petService.getAllPets({ page, limit });
        return res.status(200).json({ message: "Get all pets successful!", pets });
    } catch (error) {
        return res.status(500).json({ message: "System error!", error: error.message });
    }
}

/**
 * 🔄 Chuyển đổi trạng thái của thú cưng
 */
export const updatePetState = async (req, res) => {
    try {
        const { petId } = req.params;
        const { petState } = req.body;

        if (!petId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Thiếu ID thú cưng!"
            });
        }

        // Kiểm tra trạng thái hợp lệ
        const validStates = ["ReadyToAdopt", "NotReadyToAdopt", "Adopted"];
        if (!validStates.includes(petState)) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Trạng thái không hợp lệ! Trạng thái phải là một trong: ReadyToAdopt, NotReadyToAdopt, Adopted"
            });
        }

        const ownerId = req.user._id
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Bạn cần đăng nhập để thực hiện hành động này"
            });
        }

        // Kiểm tra quyền sở hữu
        const pet = await PetProfile.findById(petId);
        if (!pet) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Không tìm thấy thú cưng!"
            });
        }

        if (pet.ownerId.toString() !== ownerId) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "Bạn không có quyền thay đổi trạng thái của thú cưng này!"
            });
        }

        // Cập nhật trạng thái
        const updatedPet = await PetProfile.findByIdAndUpdate(
            petId,
            { petState },
            { new: true, runValidators: true }
        );

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Cập nhật trạng thái thú cưng thành công!",
            pet: updatedPet
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái thú cưng:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Đã xảy ra lỗi khi cập nhật trạng thái!",
            error: error.message
        });
    }
};

export const getOwnerPetStatistics = async (req, res) => {
    try {
        const ownerId = req.user._id;
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        const pets = await petService.getPetsByOwner(ownerId, true); // Include isDeleted
        const total = pets.length;

        const countAndPercent = (count) => ({
            count,
            percent: total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0
        });

        // Gender statistics
        const genderStats = {
            male: countAndPercent(pets.filter(p => p.gender === "male").length),
            female: countAndPercent(pets.filter(p => p.gender === "female").length),
            unknown: countAndPercent(pets.filter(p => p.gender === "unknown").length)
        };

        // Reproductive status
        const reproductiveStats = {
            neutered: countAndPercent(pets.filter(p => p.reproductiveStatus === "neutered").length),
            notNeutered: countAndPercent(pets.filter(p => p.reproductiveStatus === "not neutered").length)
        };

        // Pet state
        const petStateStats = {
            ReadyToAdopt: countAndPercent(pets.filter(p => p.petState === "ReadyToAdopt").length),
            NotReadyToAdopt: countAndPercent(pets.filter(p => p.petState === "NotReadyToAdopt").length),
            Adopted: countAndPercent(pets.filter(p => p.petState === "Adopted").length)
        };

        // Deleted & Adopted
        const isDeletedCount = pets.filter(p => p.isDeleted).length;
        const adoptedAndDeleted = pets.filter(p => p.isDeleted && p.petState === "Adopted").length;

        // Average values
        const averageAge = total > 0 ? (pets.reduce((sum, pet) => sum + pet.age, 0) / total).toFixed(1) : 0;
        const averageWeight = total > 0 ? (pets.reduce((sum, pet) => sum + (pet.weight || 0), 0) / total).toFixed(1) : 0;
        const averageHeight = total > 0 ? (pets.reduce((sum, pet) => sum + (pet.height || 0), 0) / total).toFixed(1) : 0;

        // Breed count
        const breedCount = {};
        pets.forEach(pet => {
            const breed = pet.breed || "unknown";
            breedCount[breed] = (breedCount[breed] || 0) + 1;
        });

        const breedStats = {};
        for (const [breed, count] of Object.entries(breedCount)) {
            breedStats[breed] = countAndPercent(count);
        }

        // Top 3 breeds
        const top3Breeds = Object.entries(breedStats)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 3)
            .map(([breed, stats]) => ({ breed, ...stats }));

        // Year of birth stats
        const yearOfBirthStats = {};
        pets.forEach(pet => {
            if (pet.dateOfBirth) {
                const year = new Date(pet.dateOfBirth).getFullYear();
                yearOfBirthStats[year] = (yearOfBirthStats[year] || 0) + 1;
            }
        });

        // Created month stats
        const createdMonthStats = {};
        pets.forEach(pet => {
            if (pet.createdAt) {
                const created = new Date(pet.createdAt);
                const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, "0")}`;
                createdMonthStats[key] = (createdMonthStats[key] || 0) + 1;
            }
        });

        // Final statistics
        const stats = {
            totalPets: total,
            averageAge,
            averageWeight,
            averageHeight,

            byGender: genderStats,
            byReproductiveStatus: reproductiveStats,
            byPetState: petStateStats,

            deletedCount: countAndPercent(isDeletedCount),
            adoptedAndDeletedCount: countAndPercent(adoptedAndDeleted),

            byBreed: breedStats,
            top3Breeds,

            byYearOfBirth: yearOfBirthStats,
            byCreatedMonth: createdMonthStats
        };

        return res.status(StatusCodes.OK).json({
            message: "Lấy thống kê thành công!",
            statistics: stats
        });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
