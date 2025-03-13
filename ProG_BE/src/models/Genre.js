import mongoose from "mongoose";

export const defaultGenre = ["Action", "Live Action", "Cartoons", "Japanese", "Korean", "Chinese", "Vietnamese"];
const genreSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        },
    },
    {
        versionKey: false,
    }
);

export default mongoose.model("Genre", genreSchema);
