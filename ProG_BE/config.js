// require('dotenv').config({ path: './.env' })

export const SECRET_KEY = process.env.JWT_SECRET
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "tranvantri35247@gmail.com";
export const ADMIN_EMAIL_APP_PASSWORD = process.env.ADMIN_EMAIL_APP_PASSWORD || ""
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admintesting";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123testing";
export const MAINDB_MONGODB_URL = 'mongodb://localhost:27017'
export const MAINDB_MONGODB_DBNAME = 'projectG'

export const TOTP_SECRET_KEY = "XINCJAOBANNHO"

