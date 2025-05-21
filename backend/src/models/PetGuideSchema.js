import mongoose from "mongoose"

const PetGuideSchema = mongoose.Schema({
    petGuideDocs: {
        type: [
            {
                title: {
                    type: String,
                    required: true
                }, category: {
                    type: String,
                },
                tags: [{
                    type: String
                }],
                petGuideDoc: {
                    type: String,
                },
                petGuideDocName: {
                    type: String,
                },
                petGuideDocType: {
                    type: String,
                },
                petGuideDocUrl: {
                    type: String,
                },
                petGuideDocDetails: {
                    type: String,
                },
                status: {
                    type: String,
                    enum: ['active', 'inactive', 'deleted', 'raw'],
                    default: 'active'
                }
            }
        ]
    },
    petGuideVideos: {
        type: [
            {
                platform: {
                    type: String,
                    enum: ['youtube', 'tiktok'],
                    required: true
                },
                videoId: {
                    type: String,
                    required: true
                },
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String
                },
                thumbnailUrl: {
                    type: String
                },
                channelId: {
                    type: String
                },
                channelName: {
                    type: String
                },
                publishedAt: {
                    type: Date
                },
                duration: {
                    type: String
                },
                viewCount: {
                    type: Number,
                    default: 0
                },
                likeCount: {
                    type: Number,
                    default: 0
                },
                embedUrl: {
                    type: String,
                    required: true
                },
                tags: [{
                    type: String
                }],
                category: {
                    type: String
                },
                crawledAt: {
                    type: Date,
                    default: Date.now
                },
                status: {
                    type: String,
                    enum: ['active', 'inactive'],
                    default: 'active'
                }
            }
        ]
    }
}, {
    timestamps: true
})

export default mongoose.model('PetGuide', PetGuideSchema)