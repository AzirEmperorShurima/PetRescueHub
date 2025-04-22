import mongoose from "mongoose";

const PetProfileSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        age: { type: Number, index: true, min: 0, default: 0 }, // Thêm index để tìm theo tuổi

        breed: { type: String, required: true, trim: true, index: true }, // Thêm index
        breedName: { type: String, required: true, trim: true, index: true }, // Thêm index

        gender: {
            type: String,
            required: true,
            enum: ["male", "female", "unknown"],
            default: "unknown",
            index: true // Thêm index để lọc nhanh hơn
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
                    vaccineName: { type: String, required: true, trim: true },
                    vaccinationDate: { type: Date, required: true, default: null },
                    vaccinationCode: { type: String, trim: true, default: null }
                }
            ],
            default: []
        },

        certifications: {
            type: [
                {
                    name: { type: String, required: true, trim: true },
                    type: { type: String, enum: ["image", "pdf"], required: true },
                    url: { type: String, required: true, trim: true },
                    issuedDate: { type: Date, default: null }
                }
            ],
            default: []
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true // Đã có index sẵn
        },

        avatar: { type: String, default: null },
        microchipId: { type: String, unique: true, index: { unique: true, sparse: true } },
        petAlbum: [{ type: String }], // Danh sách ảnh thú cưng
    },
    { timestamps: true }
);


PetProfileSchema.index({ breed: 1, breedName: 1 }); // Lọc nhanh theo giống & tên giống
PetProfileSchema.index({ ownerId: 1, createdAt: -1 }); // Tìm thú cưng theo chủ sở hữu và sắp xếp mới nhất

export default mongoose.model("PetProfile", PetProfileSchema);
