import type { Request, Response } from "express"
import sendResponse from "../utils/sendResponse.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import sendEmail from "../services/email/sendEmail.js"
import verificationTemplate from "../services/email/templates/verification.js"
import { generateAccessToken, generateRefreshToken, cookieOptions } from "../services/auth.service.js"
import RefreshToken from "../models/RefreshToken.js"
import { UAParser } from "ua-parser-js"

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

async function verifyCode(req: Request, res: Response) {
    const { userId, verificationCode } = req.body

    try {
        const user = await User.findById(userId)

        if (!user) {
            return sendResponse(res, { status: 404, message: "User not found" })
        }

        if (user.isVerified || user.googleId || user.authProviders.google) {
            return sendResponse(res, { status: 409, message: "User is already verified" })
        }

        if (user.verificationCode !== verificationCode) {
            return sendResponse(res, { status: 400, message: "Invalid verification code" })
        }

        if (user.verificationCodeExpiresAt && user.verificationCodeExpiresAt < new Date()) {
            return sendResponse(res, { status: 410, message: "Verification code has expired" })
        }

        user.isVerified = true
        user.verificationCode = null
        user.verificationCodeExpiresAt = null
        user.authProviders.credentials = true
        await user.save()

        const accessToken = generateAccessToken(userId)
        const refreshToken = generateRefreshToken(userId)

        const parser = new UAParser(req.headers["user-agent"])
        const result = parser.getResult()

        await RefreshToken.create({
            user: userId,
            token: refreshToken,
            deviceName: result.browser.name && result.os.name ? `${result.browser.name} on ${result.os.name}` : "unknown device",
            browser: result.browser.name ?? "unknown",
            os: result.os.name || "unknown",
            ipAddress: req.ip || "unknown",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })

        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

        const userData = {
            id: user._id.toString(),
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar.url,
            country: user.country,
            authProviders: user.authProviders,
            currentOrganization: user.currentOrg,
        }

        return sendResponse(res, { status: 200, message: "Code verified successfully", data: { userData } })
    } catch (error) {
        console.error("Failed to verify user:", error)
        return sendResponse(res, { status: 500, message: "Failed to verify user" })
    }
}

export { signup, verifyCode }