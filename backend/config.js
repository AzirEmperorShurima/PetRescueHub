// require('dotenv').config({ path: './.env' })

export const SECRET_KEY = process.env.JWT_SECRET
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tranvantri35247@gmail.com";
export const ADMIN_EMAIL_APP_PASSWORD = process.env.ADMIN_EMAIL_APP_PASSWORD || ""
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admintesting";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123testing";
export const MAINDB_MONGODB_URL = 'mongodb://localhost:27017'
export const MAINDB_MONGODB_DBNAME = 'projectG'

export const TOTP_SECRET_KEY = "XINCJAOBANNHO"

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
