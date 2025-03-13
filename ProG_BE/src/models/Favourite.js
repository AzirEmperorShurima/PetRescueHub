import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        movies: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Movie",
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("Favorite", favoriteSchema);
