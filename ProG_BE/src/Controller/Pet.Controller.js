import { StatusCodes } from "http-status-codes";
import { COOKIE_PATHS } from "../../config.js";
import * as petService from "../services/Pet/Pet.service.js";
import { getUserFieldFromToken } from "../services/User/User.service.js";
import Joi from "joi";

const petUpdateSchema = Joi.object({
    name: Joi.string().trim(),
    age: Joi.number().min(0),
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
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        const petData = {
            name: req.body.name,
            dob: req.body.petDob || null,
            breed: req.body.breed,
            breedName: req.body.breedName || null,
            age: req.body.age || 0,
            petDetails: req.body.petDetails,
            gender: req.body.gender || "unknown",
            weight: req.body.weight || 0,
            height: req.body.height || 0,
            reproductiveStatus: req.body.reproductiveStatus || "not neutered",
            vaccinationStatus: req.body.vaccinationStatus || [],
            avatar: req.body.avatar || null,
            microchipId: req.body.microchipId || null,
            petAlbum: req.body.petAlbum || [],
            createdAt: new Date()
        };

        const newPet = await petService.createPetProfile(ownerId, petData);
        res.status(201).json({ message: "Thêm thú cưng thành công!", pet: newPet });
    } catch (error) {
        res.status(400).json({ message: error.message });
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
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        await checkOwnership(petId, ownerId); // Kiểm tra quyền
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
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        if (!petId) return res.status(400).json({ message: "Missing pet ID!" });

        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        await checkOwnership(petId, ownerId);

        // Validate req.body using Joi
        const { error, value } = petUpdateSchema.validate(req.body, { allowUnknown: false, stripUnknown: true });
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const petUpdateData = value;

        const updatedPet = await petService.updatePetProfile(petId, petUpdateData);
        if (!updatedPet) return res.status(404).json({ message: "Pet not found!" });
        return res.status(200).json({ message: "Update successful!", pet: updatedPet });
    } catch (error) {
        return res.status(500).json({ message: "System error!", error: error.message });
    }
};
/**
 * 🗑 Xóa thú cưng
 */
export const deletePet = async (req, res) => {
    try {
        const { petId } = req.body;
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }
        const { ownerId } = req.body
        const pets = await petService.getPetsByOwner(ownerId);
        return res.status(200).json({ pets });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 🔍 Lấy thông tin chi tiết một thú cưng
 */
export const getPetDetails = async (req, res) => {
    try {
        const { petId } = req.params;
        const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!userId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        const isOwner = await checkOwnership(petId, ownerId);
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
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
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
        const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
        if (!ownerId) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
        }

        const {
            breed,
            gender,
            minAge,
            maxAge,
            reproductiveStatus
        } = req.query;

        const searchCriteria = { ownerId };
        if (breed) searchCriteria.breed = breed;
        if (gender) searchCriteria.gender = gender;
        if (minAge) searchCriteria.age = { ...searchCriteria.age, $gte: Number(minAge) };
        if (maxAge) searchCriteria.age = { ...searchCriteria.age, $lte: Number(maxAge) };
        if (reproductiveStatus) searchCriteria.reproductiveStatus = reproductiveStatus;

        const pets = await petService.searchPets(searchCriteria);
        return res.status(200).json({
            message: "Tìm kiếm thành công!",
            pets
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const petFilters = async (req, res) => {
    const ownerId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
    if (!ownerId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
    }
    try {
        let filter = {};

        if (req.query.breed) {
            filter.breed = { $in: req.query.breed.split(',') };
        }

        if (req.query.breedName) {
            filter.breedName = { $regex: req.query.breedName, $options: 'i' }; // Không phân biệt hoa thường
        }
        if (req.query.gender) {
            filter.gender = req.query.gender;
        }
        if (req.query.age) {
            filter.age = Number(req.query.age);
        }
        if (req.query.ageMin || req.query.ageMax) {
            filter.age = {};
            if (req.query.ageMin) {
                filter.age.$gte = parseInt(req.query.ageMin);
            }
            if (req.query.ageMax) {
                filter.age.$lte = parseInt(req.query.ageMax);
            }
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const pets = await petService.filterPetProfiles(filter, skip, limit);
        return res.status(200).json({ message: "find Pet With filter successful!", pets });
    } catch (error) {
        return res.status(500).json({ message: "System error!", error: error.message });
    }
}

export const getAllPets = async (req, res) => {
    const userId = getUserFieldFromToken(req, COOKIE_PATHS.ACCESS_TOKEN.CookieName, 'id');
    if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Bạn cần đăng nhập để thực hiện hành động này" });
    }
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const pets = await petService.getAllPets(skip, limit);
        return res.status(200).json({ message: "Get all pets successful!", pets });
    } catch (error) {
        return res.status(500).json({ message: "System error!", error: error.message });
    }
}