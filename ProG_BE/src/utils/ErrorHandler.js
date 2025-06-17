import { StatusCodes } from 'http-status-codes';

export const handleError = (res, error, message = 'Internal Server Error') => {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message, error: error.message });
};