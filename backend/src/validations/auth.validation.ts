import { z } from "zod"

const firstName = z.string().trim().min(2).max(50)
const lastName = z.string().trim().min(2).max(50)
const email = z.email().trim().toLowerCase()
const password = z.string().min(8)

export const signupSchema = z.object({
    firstName,
    lastName,
    email,
    password,
    country: z.string().trim().optional().nullable()
})