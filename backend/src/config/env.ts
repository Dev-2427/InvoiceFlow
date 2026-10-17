import dotenv from "dotenv"

dotenv.config()

export const env = {
    PORT: process.env.PORT || 3000,

    NODE_ENV: process.env.NODE_ENV || "development",

    CLIENT_URL: process.env.CLIENT_URL,

    MONGODB_URI: process.env.MONGODB_URI,

    EMAIL_USER: process.env.EMAIL_USER,

    EMAIL_PASS: process.env.EMAIL_PASS,

    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,

    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

    RESET_PASSWORD_SECRET: process.env.RESET_PASSWORD_SECRET,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,

    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,

    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT
}