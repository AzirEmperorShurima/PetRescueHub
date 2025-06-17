// require('dotenv').config({ path: './.env' })
export const SECRET_KEY = process.env.JWT_SECRET
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tranvantri35247@gmail.com";
export const ADMIN_EMAIL_APP_PASSWORD = process.env.ADMIN_EMAIL_APP_PASSWORD || ""
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admintesting";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123testing";
export const MAINDB_MONGODB_URL = 'mongodb://localhost:27017'
export const MAINDB_MONGODB_DBNAME = 'projectG'

export const parentFolder = "PetRescueHub_Images"
export const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID
export const TOTP_SECRET_KEY = "XINCJAOBANNHO"

export const COOKIE_PATHS = {
    ACCESS_TOKEN: {
        CookieName: 'ACCESS-TOKEN',
        Path: '/'
    },
    REFRESH_TOKEN: {
        CookieName: 'REFRESH_TOKEN',
        Path: '/'
    },
    REGISTER_VERIFY: {
        CookieName: 'REGISTER_VERIFY',
        Path: '/api/auth/sign'
    },
    FORGOT_PASSWORD: {
        CookieName: 'FORGOT_PASSWORD',
        Path: '/api/auth/password'
    },
    FORGOT_PASSWORD_VERIFIED: {
        CookieName: 'FORGOT_PASSWORD_VERIFIED',
        Path: '/api/auth/password'
    },
    ACCEPT_RESET_PASSWORD: {
        CookieName: 'ACCEPT_RESET_PASSWORD',
        Path: '/api/auth/password'
    },
    REPORT_COMPROMISED: {
        CookieName: 'REPORT_COMPROMISED',
        Path: '/api/auth/password'
    },
}
export const TOKEN_TYPE = {
    ACCESS_TOKEN: {
        name: 'ACCESS-TOKEN',
        expiresIn: '24h',
        maxAge: 1000 * 60 * 60 * 24, // 24h
    },
    REFRESH_TOKEN: {
        name: 'REFRESH_TOKEN',
        expiresIn: '24h',
        maxAge: 1000 * 60 * 60 * 24,
    },
    REGISTER_VERIFY: { // verify otp in email while register
        name: 'REGISTER_VERIFY',
        expiresIn: '15m',
        maxAge: 1000 * 60 * 15, // 15m
    },
    FORGOT_PASSWORD: { // accept to enter and verify otp in email while forgot password
        name: 'FORGOT_PASSWORD',
        expiresIn: '15m',
        maxAge: 1000 * 60 * 15, // 15m
    },
    FORGOT_PASSWORD_VERIFIED: {// verify otp in email while forgot password
        name: 'FORGOT_PASSWORD_VERIFIED',
        expiresIn: '15m',
        maxAge: 1000 * 60 * 15, // 15m
    },
    ACCEPT_RESET_PASSWORD: { // accept to reset password
        name: 'ACCEPT_RESET_PASSWORD',
        expiresIn: '15m',
        maxAge: 1000 * 60 * 15, // 15m
    },
    REPORT_COMPROMISED: {
        name: 'REPORT_COMPROMISED',
        expiresIn: '15m',
        maxAge: 1000 * 60 * 60 * 24, // 15m
    },

}
// Momo payment gate config 
export const MOMO_API = 'https://test-payment.momo.vn/v2/gateway/api/create'
export const accessKey = 'F8BBA842ECF85'
export const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'
export const orderInfo = 'pay with MoMo'
export const partnerCode = 'MOMO'
export const redirectUrl = 'http://localhost:5000/views/home.html'
export const ipnUrl = 'https://0778-14-178-58-205.ngrok-free.app/callback'
export const requestType = "payWithMethod";

// Zalo payment gate config

// VnPay payment gate config



// Avatar config
// config/avatars.js
export const Domain = `http://localhost:${process.env.PORT || 4000}`
export const avatarConfig = {
    defaultAvatars: {
        male: process.env.AVATAR_MALE_URL || `${Domain}/api/root/Default_Male_Avatar.jpg`,
        female: process.env.AVATAR_FEMALE_URL || `${Domain}/api/root/Default_Female_Avatar.jpg`,
        neutral: process.env.AVATAR_NEUTRAL_URL || `${Domain}/api/root/Default_Avatar_Non_Align.jpg`,
    },
}
