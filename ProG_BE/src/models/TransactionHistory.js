import mongoose from "mongoose";

const TransactionHistory = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    package_id: { type: String, required: false, ref: "PackageInformation" },
    app_trans_id: { type: String, unique: true, required: true }, // orderCode từ PayOS
    amount: { type: Number, required: true },
    payment_method: { type: String, enum: ['zalopay', 'momo','payos', 'vnpay', 'bank_transfer'], required: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
    description: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('TransactionHistory', TransactionHistory);
