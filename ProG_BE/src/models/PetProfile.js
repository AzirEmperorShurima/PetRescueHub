import mongoose from "mongoose";

const PetProfileSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        age: { type: Number, index: true, min: 0, default: 0 },

        breed: { type: String, required: true, trim: true, index: true },
        breedName: { type: String, required: true, trim: true, index: true },
        petState: { type: String, required: true, enum: ["ReadyToAdopt", "NotReadyToAdopt", "Adopted"], default: "NotReadyToAdopt" },
        isDeleted: { type: Boolean, default: false },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female", "unknown"],
            default: "unknown",
            index: true
        },
        petDetails: { type: String, required: true },
        weight: { type: Number, min: 0, default: 0 },
        height: { type: Number, min: 0, default: 0 },

        reproductiveStatus: {
            type: String,
            required: true,
            enum: ["neutered", "not neutered"],
            default: "not neutered"
        },

        vaccinationStatus: {
            type: [
                {
                    vaccineName: { type: String, trim: true },
                    vaccinationDate: { type: Date, default: null },
                    vaccinationCode: { type: String, trim: true, default: null }
                }
            ],
            default: []
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        avatar: { type: String, default: null },
        microchipId: { type: String, unique: true, index: { unique: true, sparse: true } },
        petAlbum: [{ type: String }],
    },
    { timestamps: true }
);


PetProfileSchema.index({ breed: 1, breedName: 1 }); // Lọc nhanh theo giống & tên giống
PetProfileSchema.index({ ownerId: 1, createdAt: -1 }); // Tìm thú cưng theo chủ sở hữu và sắp xếp mới nhất

export default mongoose.model("PetProfile", PetProfileSchema);
