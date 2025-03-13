import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        releaseDate: {
            type: Date,
        },
        genre: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Genre",
            },
        ],
        director: {
            type: String,
        },
        cast: [String],
        duration: {
            type: Number, // Duration in minutes
        },
        like: {
            type: Number,
            min: 0
        },
        rating: {
            type: Number,
            min: 0,
            max: 10,
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Movie", movieSchema);
