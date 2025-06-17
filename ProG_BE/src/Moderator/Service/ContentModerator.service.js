import { GoogleGenAI } from "@google/genai";
import { StatusCodes } from 'http-status-codes';
import { ModeratorPrompt } from '../Content/Prompt.js';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenAI({ apiKey: API_KEY });

export const contentModerationService = async (title, content) => {
    if (!title || title.length >= 8000) {
        const error = new Error('Input title is invalid or too long');
        error.statusCode = StatusCodes.BAD_REQUEST;
        throw error;
    }
    if (!content || content.length >= 8000) {
        const error = new Error('Input content is invalid or too long');
        error.statusCode = StatusCodes.BAD_REQUEST;
        throw error;
    }

    const TIMEOUT_MS = 10000; // 10 seconds timeout

    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('API response timed out'));
        }, TIMEOUT_MS);
    });

    try {
        const response = await Promise.race([
            genAI.models.generateContent({
                model: "gemini-2.0-flash",
                contents: ModeratorPrompt(title, content),
                config: {
                    temperature: 1,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 8192,
                    responseMimeType: "text/plain",
                },
                safetySettings: [
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
                ],
            }),
            timeoutPromise
        ]);

        let result;
        try {
            // Loại bỏ markdown nếu có
            let cleanedResponse = response.text.trim();
            if (cleanedResponse.startsWith('```json') && cleanedResponse.endsWith('```')) {
                cleanedResponse = cleanedResponse.slice(7, -3).trim();
            }
            result = JSON.parse(cleanedResponse);

            // Kiểm tra định dạng violations
            if (!result.violations || !Array.isArray(result.violations)) {
                throw new Error('Invalid response format: violations must be an array');
            }
            for (const violation of result.violations) {
                if (!violation.tag || typeof violation.reason !== 'string' || typeof violation.triggerPhrase !== 'string') {
                    throw new Error('Invalid violation format: must include tag, reason, and triggerPhrase');
                }
            }
        } catch (parseError) {
            console.error("Invalid JSON response from Gemini API:", response.text);
            const serviceError = new Error('Invalid response format from moderation service.');
            serviceError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            serviceError.originalError = parseError;
            throw serviceError;
        }

        console.log(result);
        return result;
    } catch (error) {
        console.error("Error during Gemini API call:", error.message);
        if (error.message === 'API response timed out') {
            return {
                violations: [{
                    tag: "NO_RESPONSE_VIOLATE",
                    reason: "Model failed to respond in time",
                    triggerPhrase: ""
                }]
            };
        }
        const serviceError = new Error('Failed to moderate content due to an external service error.');
        serviceError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        serviceError.originalError = error;
        throw serviceError;
    }
};

async function testContentModeration() {
    try {
        const title = `Hi, I really like eating dog meat.`;
        const content = `I really like eating dog meat, those who don't like it are damned`;

        console.log('Testing content moderation...');
        const result = await contentModerationService(title, content);
        console.log('Moderation result:', result);
    } catch (error) {
        console.error('Error during moderation:', error.message);
        if (error.statusCode) {
            console.error('Status Code:', error.statusCode);
        }
        if (error.originalError) {
            console.error('Original Error:', error.originalError);
        }
    }
}

// testContentModeration();