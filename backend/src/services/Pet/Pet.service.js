import PetProfile from "../models/PetProfile.js";
import User from "../models/User.js";


// Hàm tiện ích kiểm tra pet tồn tại
export const getPetOrThrow = async (petId) => {
    const pet = await PetProfile.findById(petId);
    if (!pet) throw new Error("Thú cưng không tồn tại!");
    return pet;
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
 * 🔄 Chuyển đổi chủ sở hữu thú cưng
 */
// export const transferPetOwnership = async (petId, newOwnerId) => {
//     const pet = await PetProfile.findById(petId);
//     if (!pet) throw new Error("Thú cưng không tồn tại!");

//     const newOwner = await User.findById(newOwnerId);
//     if (!newOwner) throw new Error("Người nhận không tồn tại!");

//     pet.ownerId = newOwnerId;
//     return await pet.save();
// };


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
        const pet = await PetProfile.findByIdAndDelete(petId);
        if (!pet) throw new Error("Thú cưng không tồn tại!");
        return pet;
    } catch (error) {
        throw new Error(`Lỗi khi xóa thú cưng: ${error.message}`);
    }
};


/**
 * 🔍 Lấy danh sách thú cưng theo chủ sở hữu
 * @param {String} ownerId - ID của chủ sở hữu
 * @returns {Promise<Array>} - Danh sách thú cưng
 */
export const getPetsByOwner = async (ownerId, ownerId, page = 1, limit = 10) => {
    return await PetProfile.find({ ownerId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
};

/**
 * 📑 Filter pet profiles based on given criteria
 * @param {Object} filter - Object chứa các tiêu chí filter: { breed, breedName, age, gender }
 * @param {Number} skip - Số lượng bản ghi cần bỏ qua (phân trang)
 * @param {Number} limit - Số lượng bản ghi cần lấy (phân trang)
 * @returns {Promise<Array>} - Danh sách pet phù hợp với tiêu chí
 */
export const filterPetProfiles = async (filter, skip, limit) => {
    const pets = await PetProfile.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(); // Sắp xếp theo ngày tạo, mới nhất trước
    const total = await PetProfile.countDocuments(filter);
    return {
        success: true, data: pets, total: total, skip: skip, limit: limit
    }
}