import mongoose from "mongoose";

const MailBlacklistSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    reason: { type: String, required: true },  // Lý do bị cấm
    addedAt: { type: Date, default: Date.now }
});

export default mongoose.model("MailBlacklist", MailBlacklistSchema)
