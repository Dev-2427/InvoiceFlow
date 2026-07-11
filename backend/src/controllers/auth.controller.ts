import type { Request, Response } from "express"
import sendResponse from "../utils/sendResponse.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import sendEmail from "../services/email/sendEmail.js"
import verificationTemplate from "../services/email/templates/verification.js"

async function signup(req: Request, res: Response) {
    const { firstName, lastName, email, password, country } = req.body

    try {
        const existingUser = await User.findOne({ email })

        if (existingUser?.isVerified || existingUser?.googleId) {
            return sendResponse(res, { status: 409, message: "Email is already registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000)
        console.log("code", newVerificationCode)

        let userId: string

        if (existingUser && !existingUser.isVerified) {
            existingUser.firstName = firstName
            existingUser.lastName = lastName
            existingUser.password = hashedPassword
            existingUser.country = country || null
            existingUser.verificationCode = newVerificationCode
            existingUser.verificationCodeExpiresAt = verificationCodeExpiry

            await existingUser.save()
            userId = existingUser._id.toString()
        } else {
            const newUser = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                country: country || null,
                verificationCode: newVerificationCode,
                verificationCodeExpiresAt: verificationCodeExpiry
            })

            userId = newUser._id.toString()
        }

        try {
            await sendEmail({ to: email, subject: "Verify your email address", html: verificationTemplate(firstName, newVerificationCode) })
        } catch (error) {
            console.error("failed to send verification email:", error)
            return sendResponse(res, { status: 500, message: "Failed to send verification code" })
        }

        return sendResponse(res, { status: 201, message: "User created successfully", data: { userId } })

    } catch (error) {
        console.error("Failed to register a user:", error)
        return sendResponse(res, { status: 500, message: "Failed to signup" })
    }

}

export { signup }