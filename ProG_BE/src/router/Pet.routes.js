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
    getAllPets,
    updatePetState,
    getPetStatistics
} from "../Controller/Pet.Controller.js";
import { checkUserAuth } from "../Middlewares/userAuthChecker.js";
import { avatarUploadMiddleware } from "../Middlewares/CloudinaryUploader.Middlware.js";
import { uploadPetAlbumImages } from "../Middlewares/GoogleDriveUploader.js";

const petRoute = Router();

petRoute.get("/", (req, res) => {
    res.status(200).json({
        message: 'Welcome to Pet API',
        status: 'success',
        timestamp: new Date().toISOString()
    });
});

// Protected routes 
petRoute.use(checkUserAuth);

petRoute.get("/v1/get-pets/filter-apply", petFilters);
petRoute.get("/v1/get-pets/all-pet", getAllPets);
// GET / api / pets / search ? breed = poodle & gender=male & minAge=1 & maxAge=5 & search=cho & page=2 & limit=5 & sortBy=age & order=asc

// CRUD operations
petRoute.post("/pets/portfolio/create", [
    avatarUploadMiddleware('pet_avatars'),
    uploadPetAlbumImages('petAlbum')
], createPet);

petRoute.put("/pets/update/:petId", updatePetProfile);
petRoute.put("/pets/update-state/:petId", updatePetState);
petRoute.delete("/pets/delete/:petId", deletePet);

// Pet information routes
petRoute.get("/pets/owner/:ownerId?", getPetsByOwner);
petRoute.get("/pets/:petId", getPetDetails);

petRoute.get("/pets/analysis/petStatistics", getPetStatistics)
// Error handling middleware
petRoute.use((err, req, res, next) => {
    console.error("Lỗi xảy ra:", err);
    res.status(500).json({
        success: false,
        error: "Internal Server Error"
    });
});

export default petRoute;