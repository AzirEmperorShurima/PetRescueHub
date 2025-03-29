import * as petService from "../services/pet.service.js";
import { getUserIdFromCookies } from "../services/User/User.service.js";

/**
 * 🆕 Tạo thú cưng mới
 */
export const createPet = async (req, res) => {
    try {
        const ownerId = getUserIdFromCookies(req)
        const newPet = await petService.createPet(ownerId, req.body);
        res.status(201).json({ message: "Thêm thú cưng thành công!", pet: newPet });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 🔄 Chuyển đổi chủ sở hữu thú cưng
 */
export const transferPetOwnership = async (req, res) => {
    try {
        const { petId, newOwnerId } = req.body;
        const updatedPet = await petService.transferPetOwnership(petId, newOwnerId);
        res.status(200).json({ message: "Chuyển quyền sở hữu thành công!", pet: updatedPet });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 📥 Upload avatar thú cưng
 */
export const uploadPetAvatar = async (req, res) => {
    try {
        const { petId } = req.body;
        const avatarUrl = req.file.path; // Ảnh lưu trên server hoặc Cloud storage

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
        const certificateUrl = req.file.path;

        const updatedPet = await petService.uploadPetCertificate(petId, { name: certificateName, type: certificateType, url: certificateUrl });

        res.status(200).json({ message: "Upload giấy chứng nhận thành công!", pet: updatedPet });
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
        const updatedPet = await petService.updatePetProfile(petId, req.body);
        res.status(200).json({ message: "Cập nhật thành công!", pet: updatedPet });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 🗑 Xóa thú cưng
 */
export const deletePet = async (req, res) => {
    try {
        const { petId } = req.params;
        await petService.deletePet(petId);
        res.status(200).json({ message: "Xóa thú cưng thành công!" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * 🔍 Lấy danh sách thú cưng theo chủ sở hữu
 */
export const getPetsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const pets = await petService.getPetsByOwner(ownerId);
        res.status(200).json({ pets });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
