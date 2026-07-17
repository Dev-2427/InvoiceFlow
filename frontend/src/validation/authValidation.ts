import z from "zod";

const firstName = z.string().trim().min(2, { error: "First name must be at least 2 characters" }).max(50)
const email = z.email({ error: "Invalid email address" })
const password = z.string().min(8, { error: "Password must be at least 8 characters" })
const verificationCode = z.string().trim().regex(/^\d{6}$/, "verification code must be exactly 6 digits")
const userId = z.string()

export const signupSchema = z.object({
    firstName,
    lastName: z.preprocess(value => value === "" ? undefined : value, z.string().trim().max(50).optional()),
    country: z.preprocess(value => value === "" ? undefined : value, z.string().trim().optional()),
    email,
    password
})

export const verifyCodeSchema = z.object({
    userId,
    verificationCode
})

export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;