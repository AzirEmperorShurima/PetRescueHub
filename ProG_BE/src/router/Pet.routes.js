import { Router } from "express";
import {
    createPet,
    transferPetOwnership,
    uploadPetAvatar,
    uploadPetCertificate,
    updatePetProfile,
    deletePet,
    getPetsByOwner
} from "../Controller/Pet.Controller.js";

const petRoute = Router()

petRoute.post("/create", createPet);
petRoute.put("/transfer", transferPetOwnership);
petRoute.post("/upload-avatar", upload.single("avatar"), uploadPetAvatar);
petRoute.post("/upload-certificate", upload.single("certificate"), uploadPetCertificate);
petRoute.put("/update/:petId", updatePetProfile);
petRoute.delete("/delete/:petId", deletePet);
petRoute.get("/owner/:ownerId", getPetsByOwner);

export default petRoute;