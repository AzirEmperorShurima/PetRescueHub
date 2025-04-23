import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../config.js';

export const generateToken = (payload, expiresIn = '1d') => jwt.sign(payload, SECRET_KEY, { expiresIn });
export const verifyToken = (token) => jwt.verify(token, SECRET_KEY);