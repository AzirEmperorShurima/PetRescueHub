import mongoose from "mongoose";

const rescueMissionHistorySchema = new mongoose.Schema({
    missionId: {
        type: String,
        required: true,
        unique: true,
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Có thể là user thật hoặc user guest
        required: false
    },
    guestInfo: {
        fullname: String,
        phone: String,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
        }
    },
    radius: {
        type: Number,
        required: true, // bán kính người dùng chọn
    },
    selectedVolunteers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    acceptedVolunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    startedAt: {
        type: Date,
        default: Date.now,
    },
    endedAt: {
        type: Date,
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending',
    },
    notes: {
        type: String,
    }
}, {
    timestamps: true,
    versionKey: false,
});

rescueMissionHistorySchema.index({ location: '2dsphere' });

export default mongoose.model("RescueMissionHistory", rescueMissionHistorySchema);
