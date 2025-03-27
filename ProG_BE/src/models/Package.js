const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    package_id: { type: String, unique: true, required: true }, // PREMIUM_1, VIP_1, DONATE_50,...
    name: { type: String, required: true }, // Tên hiển thị UI
    description: { type: String, required: true }, // Mô tả gói
    price: { type: Number, required: true },
    duration: { type: Number, required: true, default: 0 }, // số ngày sử dụng
    currency: { type: String, required: true, default: 'VND' }
});

export default mongoose.model('PackageInformation', PackageSchema);

