import mongoose from "mongoose";

const rescueMissionHistorySchema = new mongoose.Schema({
    missionId: {
        type: String,
        required: true,
        unique: true,
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number], 
            required: true,
        }
    },
    radius: {
        type: Number,
        required: true,
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
