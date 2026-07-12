import mongoose from "mongoose"
import { z } from "zod"

const firstName = z.string().trim().min(2).max(50)
const lastName = z.string().trim().min(2).max(50)
const email = z.email().trim().toLowerCase()
const password = z.string().min(8)
const userId = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), { message: "Invalid user ID" })
const verificationCode = z.string().trim().regex(/^\d{6}$/, "verification code must be exactly 6 digits")

export const signupSchema = z.object({
    firstName,
    lastName,
    email,
    password,
    country: z.string().trim().optional().nullable()
})

export const verifyCodeSchema = z.object({
    userId,
    verificationCode
})