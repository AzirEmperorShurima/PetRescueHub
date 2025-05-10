import { Router } from "express";
import {
    createPet,
    uploadPetAvatar,
    uploadPetCertificate,
    updatePetProfile,
    deletePet,
    getPetsByOwner,
    petFilters,
    getPetDetails,
    getAllPets
} from "../Controller/Pet.Controller.js";

const petRoute = Router()

petRoute.get("/", (req, res) => {
    res.status(200).json({
        message: 'Welcome to Pet API',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// 📌 Routes liên quan đến Pet
petRoute.post("/portfolio/create", 
    avatarUploadMiddleware('pet_avatars'),
    uploadPostImages('petAlbum', 'petAlbum'),
    createPet
);
petRoute.put("/portfolio/update/:petId", [checkUserAuth], updatePetProfile);
petRoute.patch("/portfolio/update-state/:petId", [checkUserAuth], updatePetState);
petRoute.delete("/portfolio/delete/:petId", deletePet);

// 📌 Upload files (Avatar & Certificate)
// petRoute.post("/portfolio/upload-avatar/:petId", upload.single("avatar"), uploadPetAvatar);
// petRoute.post("/portfolio/upload-certificate/:petId", upload.single("certificate"), uploadPetCertificate);

// 📌 Lọc pet theo các tiêu chí (breed, age, gender,...)
petRoute.get("/portfolio/filter", petFilters);

// 📌 Lấy danh sách pet theo owner
petRoute.get("/portfolio/owner/:ownerId", getPetsByOwner);

// 📌 Lấy thông tin pet theo ID
petRoute.get("/portfolio/:petId", getPetDetails);

// 📌 Lấy tất cả pet (có thể phân trang)
petRoute.get("/portfolio/all", getAllPets);

// 📌 Middleware xử lý lỗi chung
petRoute.use((err, req, res, next) => {
    console.error("Lỗi xảy ra:", err);
    res.status(500).json({ error: "Internal Server Error" });
});
export default petRoute;