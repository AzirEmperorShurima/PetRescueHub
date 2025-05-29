import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export const prepareForDatabase = (jsonResponse, postId, title, content, authorId, postType = 'ForumPost') => {
    try {

        const parsedResponse = JSON.parse(jsonResponse);


        if (!parsedResponse.violations || !Array.isArray(parsedResponse.violations)) {
            const error = new Error('Invalid JSON response: violations must be an array');
            error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            throw error;
        }
        for (const violation of parsedResponse.violations) {
            if (!violation.tag || typeof violation.reason !== 'string' || typeof violation.triggerPhrase !== 'string') {
                throw new Error('Invalid violation format: must include tag, reason, and triggerPhrase');
            }
        }

        // Chuẩn bị dữ liệu cho database
        const dbEntry = {
            _id: postId ? new mongoose.Types.ObjectId(String(postId)) : new mongoose.Types.ObjectId(),
            title: title || 'No title provided',
            content: content || 'No content provided',
            author: authorId ? new mongoose.Types.ObjectId(String(authorId)) : null,
            violate_tags: parsedResponse.violations.map(v => v.tag),
            postStatus: parsedResponse.violations.some(v => v.tag !== 'NO_VIOLATE_DISCOVERED') ? 'hidden' : 'public',
            createdAt: new Date(),
            updatedAt: new Date(),
        };


        if (postType === 'Question') {
            dbEntry.questionDetails = content;
        } else if (postType === 'FindLostPetPost') {
            dbEntry.lostPetInfo = content;
        } else if (postType === 'EventPost') {
            dbEntry.approvalStatus = 'pending';
        }

        return { dbEntry, postType };
    } catch (error) {
        console.error('Error parsing JSON response:', error.message);
        const dbError = new Error('Failed to prepare data for database');
        dbError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        dbError.originalError = error;
        throw dbError;
    }
};