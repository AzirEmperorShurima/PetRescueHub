/**
 * Tạo một gói package mới trong database
 * @param {Object} packageData - Dữ liệu gói mới (package_id, name, price, duration)
 * @returns {Promise<Object>} - Trả về package vừa tạo hoặc lỗi
 */

export const createPackage = async (packageData) => {
    try {
        if (!packageData) {
            return { success: false, message: 'Dữ liệu package không được để trống!' };
        }
        // Kiểm tra xem package_id đã tồn tại chưa
        const existingPackage = await Package.findOne({ package_id: packageData.package_id });
        if (existingPackage) {
            return { success: false, message: 'Gói đã tồn tại!' };
        }

        // Tạo package mới
        const newPackage = new Package(packageData);
        await newPackage.save();
        return { success: true, data: newPackage, message: 'Tạo package thành công!' };
    } catch (error) {
        console.error('Lỗi khi tạo package:', error);
        return { success: false, message: 'Lỗi server', message: error.message };
    }
};