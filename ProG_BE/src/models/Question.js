import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    imageUrls: { type: String },
    tags: [{ type: String }],
    reactions: {
        like: { type: Number, default: 0 },
        love: { type: Number, default: 0 },
        haha: { type: Number, default: 0 },
        sad: { type: Number, default: 0 },
        angry: { type: Number, default: 0 }
    },
    favoriteCount: { type: Number, default: 0 }, // Tổng số lượt yêu thích
    views: { type: Number, default: 0 },
    questionStatus: { type: String, enum: ["open", "hidden"], default: "open" },
    createdAt: { type: Date, default: Date.now }
});

async function addReaction(questionId, type) {
    await Question.findByIdAndUpdate(questionId, { $inc: { [`reactions.${type}`]: 1 } });
}
async function removeReaction(questionId, type) {
    await Question.findByIdAndUpdate(questionId, { $inc: { [`reactions.${type}`]: -1 } });
}
async function getReactions(questionId) {
    const question = await Question.findById(questionId);
    return question.reactions;
}
// Middleware kiểm tra quyền trước khi đăng câu hỏi
// QuestionSchema.pre("save", async function (next) {
//     const userPermissions = await UserPermissions.findOne({ user: this.author });

//     if (!userPermissions) {
//         throw new Error("Không tìm thấy quyền của người dùng!");
//     }

//     if (userPermissions.isBanned) {
//         throw new Error("Bạn đã bị cấm hoạt động!");
//     }

//     if (!userPermissions.canPostQuestion) {
//         throw new Error("Bạn không có quyền đăng câu hỏi!");
//     }

//     next();
// });
export default mongoose.model("Question", QuestionSchema);