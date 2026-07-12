import dotenv from "dotenv"

dotenv.config()

export const env = {
    PORT: process.env.PORT || 3000,

    NODE_ENV: process.env.NODE_ENV || "development",

    CLIENT_URL: process.env.CLIENT_URL,

    MONGODB_URI: process.env.MONGODB_URI,

    EMAIL_USER: process.env.EMAIL_USER,

    EMAIL_PASS: process.env.EMAIL_Pass,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,

    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
}