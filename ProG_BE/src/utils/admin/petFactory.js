import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import models_list from "../../models/modelsExport.js";

export const createPetsFromJSON = async (jsonPath = "./petSeed.json") => {
    try {
        // Đọc dữ liệu từ file JSON
        const rawData = fs.readFileSync(jsonPath, "utf8");
        const pets = JSON.parse(rawData);
        
        console.log(`🐾 Bắt đầu thêm ${pets.length} thú cưng vào cơ sở dữ liệu...`);
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const pet of pets) {
            try {
                // Tìm chủ sở hữu dựa trên email
                const owner = await models_list.user.findOne({ email: pet.ownerEmail });
                
                if (!owner) {
                    console.warn(`❌ Không tìm thấy chủ sở hữu với email "${pet.ownerEmail}". Bỏ qua thú cưng "${pet.name}"...`);
                    errorCount++;
                    continue;
                }
                
                // Kiểm tra xem microchipId đã tồn tại chưa (nếu có)
                if (pet.microchipId) {
                    const existingPet = await models_list.PetProfile.findOne({ microchipId: pet.microchipId });
                    if (existingPet) {
                        console.warn(`⚠️ Thú cưng với microchipId "${pet.microchipId}" đã tồn tại. Bỏ qua thú cưng "${pet.name}"...`);
                        errorCount++;
                        continue;
                    }
                }
                
                // Tạo đối tượng thú cưng mới
                const newPet = new models_list.PetProfile({
                    name: pet.name,
                    age: pet.age,
                    petDob: pet.petDob ? new Date(pet.petDob) : null,
                    breed: pet.breed,
                    breedName: pet.breedName,
                    petState: pet.petState,
                    gender: pet.gender,
                    petDetails: pet.petDetails,
                    weight: pet.weight,
                    height: pet.height,
                    reproductiveStatus: pet.reproductiveStatus,
                    vaccinationStatus: pet.vaccinationStatus || [],
                    ownerId: owner._id,
                    avatar: pet.avatar,
                    microchipId: pet.microchipId,
                    petAlbum: pet.petAlbum || []
                });
                
                // Lưu thú cưng vào cơ sở dữ liệu
                await newPet.save();
                successCount++;
                console.log(`✅ Đã thêm thú cưng: ${pet.name} (Chủ sở hữu: ${owner.username})`);
            } catch (error) {
                console.error(`❌ Lỗi khi thêm thú cưng "${pet.name}": ${error.message}`);
                errorCount++;
            }
        }
        
        console.log(`🎉 Hoàn thành! Đã thêm thành công ${successCount}/${pets.length} thú cưng. Có ${errorCount} lỗi.`);
    } catch (error) {
        console.error(`❌ Lỗi khi đọc file hoặc xử lý dữ liệu: ${error.message}`);
    }
};