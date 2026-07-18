import mongoose from "mongoose"
import { z } from "zod"

const firstName = z.string().trim().min(2).max(50)
const lastName = z.string().trim().min(2).max(50).optional()
const email = z.email().trim().toLowerCase()
const password = z.string().min(8)
const userId = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid user ID" })
const verificationCode = z.string().trim().regex(/^\d{6}$/, "verification code must be exactly 6 digits")

export const signupSchema = z.object({
    firstName,
    lastName,
    email,
    password,
    country: z.string().trim().optional()
})

export const signinSchema = z.object({
    email,
    password
})

export const verifyCodeSchema = z.object({
    userId,
    verificationCode
})

export const forgotPasswordSchema = z.object({
    email
})

export const passwordSchema = z.object({
    password
})

export const changePasswordSchema = z.object({
    oldPassword: password,
    newPassword: password
})

export const googleAuthSchema = z.object({
    code: z.string().trim().min(1, "Authorization code is reqired")
})