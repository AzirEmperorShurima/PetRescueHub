import PetProfile from "../../models/PetProfile.js";
import User from "../../models/user.js";


// Hàm tiện ích kiểm tra pet tồn tại
export const getPetOrThrow = async (petId) => {
    const pet = await PetProfile.findById(petId);
    if (!pet) throw new Error("Thú cưng không tồn tại!");
    return pet;
};

/**
 * 🔧 Xây dựng bộ lọc thú cưng từ query
 */
const buildPetFilter = (ownerId, query) => {
    const filter = { ownerId };

    if (query.name) {
        filter.name = { $regex: query.name, $options: 'i' };
    }

    if (query.gender) {
        filter.gender = query.gender;
    }

    if (query.petState) {
        filter.petState = query.petState;
    }

    if (query.ageMin || query.ageMax) {
        filter.age = {};
        if (query.ageMin) filter.age.$gte = parseInt(query.ageMin);
        if (query.ageMax) filter.age.$lte = parseInt(query.ageMax);
    }

    if (query.breed) {
        filter.breed = { $in: query.breed.split(',') };
    }

    if (query.breedName) {
        filter.breedName = { $regex: query.breedName, $options: 'i' };
    }

    if (query.search) {
        const searchRegex = new RegExp(query.search, 'i');
        filter.$or = [
            { name: searchRegex },
            { breed: searchRegex },
            { breedName: searchRegex }
        ];
    }

    return filter;
};


export const getAllPets = async ({ page = 1, limit = 10 }) => {
    const skip = (page - 1) * limit;

    const filter = {
        isDeleted: false,
        petState: "ReadyToAdopt"
    };

    const [pets, total] = await Promise.all([
        PetProfile.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        PetProfile.countDocuments(filter)
    ]);

    return { success: true, data: pets, total, page, limit };
};

/**
 * 🆕 Tạo thú cưng mới
 * @param {String} ownerId - ID của chủ sở hữu
 * @param {Object} petData - Dữ liệu thú cưng
 * @returns {Promise<Object>} - Hồ sơ thú cưng đã tạo
 */
export const createPetProfile = async (ownerId, petData) => {
    try {
        const userExists = await User.findById(ownerId);
        if (!userExists) throw new Error("Pet Owner Not Exist !");

        // Tạo thú cưng mới
        const newPet = new PetProfile({ ownerId, ...petData });
        return await newPet.save();
    } catch (error) {
        throw new Error(`Lỗi khi tạo hồ sơ thú cưng: ${error.message}`);
    }
};

/**
 * 📥 Upload avatar thú cưng
 * @param {String} petId - ID của thú cưng
 * @param {String} avatarUrl - URL avatar mới
 * @returns {Promise<Object>} - Hồ sơ thú cưng đã cập nhật
 */
export const updatePetAvatar = async (petId, avatarUrl) => {
    const pet = await getPetOrThrow(petId);
    pet.avatar = avatarUrl;
    return await pet.save();
};

/**
 * 📂 Upload giấy chứng nhận
 * @param {String} petId - ID của thú cưng
 * @param {Object} certificateData - Dữ liệu giấy chứng nhận
 * @returns {Promise<Object>} - Hồ sơ thú cưng đã cập nhật
 */
export const uploadPetCertificate = async (petId, certificateData) => {
    const pet = await getPetOrThrow(petId);

    pet.certifications.push({
        name: certificateData.name,
        type: certificateData.type,
        url: certificateData.url,
        issuedDate: new Date(),
    });

    return await pet.save();
};

/**
 * 📑 Cập nhật hồ sơ thú cưng
 * @param {String} petId - ID của thú cưng
 * @param {Object} updatedData - Dữ liệu cần cập nhật
 * @returns {Promise<Object>} - Hồ sơ thú cưng đã cập nhật
 */
export const updatePetProfile = async (petId, updatedData) => {
    const pet = await PetProfile.findByIdAndUpdate(
        petId,
        { $set: updatedData },
        { new: true, runValidators: true }
    );
    if (!pet) throw new Error("Thú cưng không tồn tại!");
    return pet;
};

/**
 * 🗑 Xóa thú cưng
 * @param {String} petId - ID của thú cưng
 * @returns {Promise<Object>} - Hồ sơ thú cưng đã xóa
 */
export const deletePet = async (petId) => {
    try {
        const pet = await PetProfile.findById(petId);
        if (!pet) throw new Error("Thú cưng không tồn tại!");
        if (pet.petState === "Adopted") {
            pet.isDeleted = true;
            await pet.save();
            return pet;
        } else {
            const deletedPet = await PetProfile.findByIdAndDelete(petId);
            return deletedPet;
        }
    } catch (error) {
        throw new Error(`Lỗi khi xóa thú cưng: ${error.message}`);
    }
};


/**
 * 🔍 Lấy danh sách thú cưng theo chủ sở hữu
 * @param {String} ownerId - ID của chủ sở hữu
 * @returns {Promise<Array>} - Danh sách thú cưng
 */
export const getPetsByOwnerWithFilter = async (ownerId, query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const filter = buildPetFilter(ownerId, query);

    const [pets, total] = await Promise.all([
        PetProfile.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        PetProfile.countDocuments(filter)
    ]);

    return {
        pets,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

/**
 * 📑 Filter pet profiles based on given criteria
 * @param {Object} filter - Object chứa các tiêu chí filter: { breed, breedName, age, gender }
 * @param {Number} skip - Số lượng bản ghi cần bỏ qua (phân trang)
 * @param {Number} limit - Số lượng bản ghi cần lấy (phân trang)
 * @returns {Promise<Array>} - Danh sách pet phù hợp với tiêu chí
 */
export const filterPetProfiles = async (filter, skip, limit) => {
    const [pets, total] = await Promise.all([
        PetProfile.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean(),
        PetProfile.countDocuments(filter)
    ]);

    return {
        success: true,
        data: pets,
        total,
        skip,
        limit
    };
};

/**
 * Tìm thú cưng theo microchipId
 * @param {String} microchipId - Microchip ID cần kiểm tra
 * @returns {Promise<Object|null>} - Thú cưng nếu tìm thấy, null nếu không tìm thấy
 */
export const findPetByMicrochipId = async (microchipId) => {
    try {
        return await PetProfile.findOne({ microchipId });
    } catch (error) {
        throw new Error(`Lỗi khi tìm kiếm thú cưng theo microchipId: ${error.message}`);
    }
};

/**
 * Cập nhật microchip ID
 * @param {String} petId - ID của thú cưng
 * @param {String} microchipId - Microchip ID mới
 * @returns {Promise<Object>} - Hồ sơ thú cưng đã cập nhật
 */
export const updateMicrochipId = async (petId, microchipId) => {
    const pet = await getPetOrThrow(petId);
    pet.microchipId = microchipId;
    return await pet.save();
};

/**
 * Thêm bản ghi tiêm phòng mới
 * @param {String} petId - ID của thú cưng
 * @param {Object} vaccinationData - Dữ liệu tiêm phòng
 * @returns {Promise<Object>} - Hồ sơ thú cưng đã cập nhật
 */
export const addVaccinationRecord = async (petId, vaccinationData) => {
    const pet = await getPetOrThrow(petId);
    pet.vaccinationStatus.push(vaccinationData);
    return await pet.save();
};

/**
 * Thêm ảnh vào album thú cưng
 * @param {String} petId - ID của thú cưng
 * @param {String} photoUrl - URL ảnh cần thêm
 * @returns {Promise<Object>} - Hồ sơ thú cưng đã cập nhật
 */
export const addPhotoToAlbum = async (petId, photoUrl) => {
    const pet = await getPetOrThrow(petId);
    pet.petAlbum.push(photoUrl);
    return await pet.save();
};

/**
 * Xóa ảnh khỏi album thú cưng
 * @param {String} petId - ID của thú cưng
 * @param {String} photoUrl - URL ảnh cần xóa
 * @returns {Promise<Object>} - Hồ sơ thú cưng đã cập nhật
 */
export const removePhotoFromAlbum = async (petId, photoUrl) => {
    const pet = await getPetOrThrow(petId);
    pet.petAlbum = pet.petAlbum.filter(url => url !== photoUrl);
    return await pet.save();
};

/**
 * Lấy danh sách thú cưng theo chủ sở hữu
 * @param {String} ownerId - ID của chủ sở hữu
 * @returns {Promise<Array>} - Danh sách thú cưng
 */
export const getPetsByOwner = async (ownerId) => {
    return await PetProfile.find({ ownerId}).lean();
};


/**
 * 🔍 Tìm kiếm thú cưng theo nhiều tiêu chí, có phân trang và sắp xếp
 * @param {Object} query - Query từ client
 * @param {String} ownerId - ID của người dùng (tuỳ chọn)
 * @returns {Promise<{ results: Array, total: Number }>}
 */
export const searchPets = async (query, ownerId = null) => {
    const filter = buildPetFilter(ownerId, query);

    // Phân trang
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sắp xếp (mặc định theo thời gian tạo mới nhất)
    let sort = { createdAt: -1 };
    if (query.sortBy && query.order) {
        sort = { [query.sortBy]: query.order === 'asc' ? 1 : -1 };
    }

    const [results, total] = await Promise.all([
        PetProfile.find(filter).sort(sort).skip(skip).limit(limit).lean(),
        PetProfile.countDocuments(filter)
    ]);

    return { results, total };
};