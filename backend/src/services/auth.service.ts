import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import type { CookieOptions } from "express"

export function generateAccessToken(userId: string) {
    return jwt.sign(
        { userId }, env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "15m" })
}

export function generateRefreshToken(userId: string) {
    return jwt.sign(
        { userId }, env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "7d" }
    )
}

export const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    secure: env.NODE_ENV === "production"
} 