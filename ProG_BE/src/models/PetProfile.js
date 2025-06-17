import mongoose from "mongoose";

const PetProfileSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        age: { type: Number, index: true, min: 0, default: 0 },
        petDob: { type: Date, default: null },
        breed: { type: String, required: true, trim: true, index: true },
        breedName: { type: String, required: true, trim: true, index: true },
        petState: {
            type: String,
            required: true,
            enum: ["ReadyToAdopt", "NotReadyToAdopt", "Adopted"],
            default: "NotReadyToAdopt",
        },
        isDeleted: { type: Boolean, default: false },
        gender: {
            type: String,
            required: true,
            enum: ["male", "female", "unknown"],
            default: "unknown",
            index: true,
        },
        petDetails: { type: String, required: true },
        weight: { type: Number, min: 0, default: 0 },
        height: { type: Number, min: 0, default: 0 },
        reproductiveStatus: {
            type: String,
            required: true,
            enum: ["neutered", "not neutered"],
            default: "not neutered",
        },
        vaccinationStatus: {
            type: [
                {
                    vaccineName: { type: String, trim: true },
                    vaccinationDate: { type: Date, default: null },
                    vaccinationCode: { type: String, trim: true, default: null },
                },
            ],
            default: [],
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        avatar: { type: String, default: null },
        microchipId: {
            type: String,
            // sparse: true,
            // unique: true, // Chỉ mục unique // Cho phép nhiều document có giá trị null
            // default: null,
            // trim: true, // Loại bỏ khoảng trắng
        },
        petAlbum: [{ type: String }],
    },
    { timestamps: true }
);

// Xóa chỉ mục trùng lặp
PetProfileSchema.index({ breed: 1, breedName: 1 }); // Lọc nhanh theo giống & tên giống
PetProfileSchema.index({ ownerId: 1, createdAt: -1 }); // Tìm thú cưng theo chủ sở hữu và sắp xếp mới nhất
PetProfileSchema.index({ microchipId: 1 }, { unique: true, sparse: true });


export default mongoose.model("PetProfile", PetProfileSchema);