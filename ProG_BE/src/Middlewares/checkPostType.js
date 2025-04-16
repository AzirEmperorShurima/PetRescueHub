import { PostModel } from "../models/PostSchema";

export const checkPostType = (req, res, next) => {
    try {
        const postType = req.body.postType;
        if (!postType) {
            return res.status(400).json({
                success: false,
                message: 'postType is required',
                time: new Date().toISOString()
            });
        }
        const validPostTypes = Object.keys(PostModel.discriminators || {});
        if (!validPostTypes.includes(postType)) {
            return res.status(400).json({
                success: false,
                message: `Invalid postType. Must be one of: ${validPostTypes.join(', ')}`
            });
        }
        next()
    } catch (error) {
        console.error('Error in postType validation middleware:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during postType validation'
        });
    }
}
