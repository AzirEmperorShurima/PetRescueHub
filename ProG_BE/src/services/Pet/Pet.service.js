import PetProfile from "../models/PetProfile.js";
import User from "../models/User.js";

/**
 * 🆕 Tạo thú cưng mới
 */
export const createPetProfile = async (ownerId, petData) => {
    // Kiểm tra chủ sở hữu có tồn tại không
    const userExists = await User.findById(ownerId);
    if (!userExists) throw new Error("Chủ sở hữu không tồn tại!");

    // Tạo thú cưng mới
    const newPet = new PetProfile(petData);
    return await newPet.save();
};

/**
 * 🔄 Chuyển đổi chủ sở hữu thú cưng
 */
export const transferPetOwnership = async (petId, newOwnerId) => {
    const pet = await PetProfile.findById(petId);
    if (!pet) throw new Error("Thú cưng không tồn tại!");

    const newOwner = await User.findById(newOwnerId);
    if (!newOwner) throw new Error("Người nhận không tồn tại!");

    pet.ownerId = newOwnerId;
    return await pet.save();
};


/**
 * 📥 Upload avatar thú cưng
 */
export const updatePetAvatar = async (petId, avatarUrl) => {
    const pet = await PetProfile.findById(petId);
    if (!pet) throw new Error("Thú cưng không tồn tại!");

    pet.avatar = avatarUrl;
    return await pet.save();
};

/**
 * 📂 Upload giấy chứng nhận
 */
export const uploadPetCertificate = async (petId, certificateData) => {
    const pet = await PetProfile.findById(petId);
    if (!pet) throw new Error("Thú cưng không tồn tại!");

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
 */
export const updatePetProfile = async (petId, updatedData) => {
    const pet = await PetProfile.findByIdAndUpdate(petId, updatedData, { new: true });
    if (!pet) throw new Error("Thú cưng không tồn tại!");

    return pet;
};

/**
 * 🗑 Xóa thú cưng
 */
export const deletePet = async (petId) => {
    const pet = await PetProfile.findByIdAndDelete(petId);
    if (!pet) throw new Error("Thú cưng không tồn tại!");

    return pet;
};

/**
 * 🔍 Lấy danh sách thú cưng theo chủ sở hữu
 */
export const getPetsByOwner = async (ownerId) => {
    return await PetProfile.find({ ownerId }).sort({ createdAt: -1 });
};