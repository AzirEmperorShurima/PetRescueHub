import * as petService from "../services/Pet/Pet.service.js";
import { getUserIdFromCookies } from "../services/User/User.service.js";


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
        const ownerId = getUserIdFromCookies(req)
        if (!ownerId) {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập!" });
        }

        const petData = {
            name: req.body.name,
            dob: req.body.petDob || null,
            breed: req.body.breed,
            breedName: req.body.breedName || null, // Nếu không có breedName thì để null
            age: req.body.age || 0,
            details: req.body.details,
            gender: req.body.gender || "unknown",
            weight: req.body.weight || 0,
            avatar: req.body.avatar || null,  // Nếu không có avatar thì để null
            microchipId: req.body.microchipId || null,
            healthRecords: req.body.healthRecords || [],
            certifications: req.body.certifications || [],
            createdAt: new Date()
        };
        const newPet = await petService.createPetProfile(ownerId, petData);
        res.status(201).json({ message: "Thêm thú cưng thành công!", pet: newPet });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 🔄 Chuyển đổi chủ sở hữu thú cưng
 */
// export const transferPetOwnership = async (req, res) => {
//     try {
//         const { petId, newOwnerId } = req.body;
//         const updatedPet = await petService.transferPetOwnership(petId, newOwnerId);
//         res.status(200).json({ message: "Chuyển quyền sở hữu thành công!", pet: updatedPet });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

/**
 * 📥 Upload avatar thú cưng
 */
export const uploadPetAvatar = async (req, res) => {
    try {
        const { petId, avatarUrl } = req.body
        const ownerId = getUserIdFromCookies(req);
        if (!ownerId) throw new Error("Người dùng chưa đăng nhập!");
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
        const ownerId = getUserIdFromCookies(req);
        if (!ownerId) throw new Error("Người dùng chưa đăng nhập!");

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
        const { petId } = req.body;
        if (!petId) return res.status(400).json({ message: "Thiếu ID thú cưng!" });
        const ownerId = getUserIdFromCookies(req);
        if (!ownerId) throw new Error("Người dùng chưa đăng nhập!");

        await checkOwnership(petId, ownerId); // Kiểm tra quyền
        const updatedPet = await petService.updatePetProfile(petId, req.body);
        if (!updatedPet) return res.status(404).json({ message: "Không tìm thấy thú cưng!" });
        return res.status(200).json({ message: "Cập nhật thành công!", pet: updatedPet });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống!", error: error.message });
    }
};

/**
 * 🗑 Xóa thú cưng
 */
export const deletePet = async (req, res) => {
    try {
        const { petId } = req.body;
        const ownerId = getUserIdFromCookies(req);
        if (!ownerId) throw new Error("Người dùng chưa đăng nhập!");

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
        const { ownerId } = req.body
        const pets = await petService.getPetsByOwner(ownerId);
        return res.status(200).json({ pets });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
