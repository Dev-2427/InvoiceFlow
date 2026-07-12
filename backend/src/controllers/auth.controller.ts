import type { Request, Response } from "express"
import sendResponse from "../utils/sendResponse.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import sendEmail from "../services/email/sendEmail.js"
import verificationTemplate from "../services/email/templates/verification.js"
import { generateAccessToken, generateRefreshToken, cookieOptions, clearAllCookies } from "../services/auth.service.js"
import RefreshToken from "../models/RefreshToken.js"
import { UAParser } from "ua-parser-js"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"

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

async function signin(req: Request, res: Response) {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email }).lean()

        if (!user) {
            return sendResponse(res, { status: 401, message: "Invalid credentials" })
        }

        if (user.authProviders.google && !user.authProviders.credentials) {
            return sendResponse(res, { status: 409, message: "This account is linked with google. Please sign in with google." })
        }

        if (!user.isVerified) {
            return sendResponse(res, { status: 403, message: "Please verify your email address before signing in" })
        }

        const correctPassword = await bcrypt.compare(password, user.password!)

        if (!correctPassword) {
            return sendResponse(res, { status: 401, message: "Invalid credentials" })
        }

        const activeSessions = await RefreshToken.find({ user: user._id }).sort({ lastUsedAt: 1 })

        if (activeSessions.length >= 3) {
            await activeSessions[0]?.deleteOne()
        }

        const parser = new UAParser(req.headers["user-agent"])
        const result = parser.getResult()

        const accessToken = generateAccessToken(user._id.toString())
        const refreshToken = generateRefreshToken(user._id.toString())

        await RefreshToken.create({
            user: user._id,
            token: refreshToken,
            deviceName: result.browser.name && result.os.name ? `${result.browser.name} on ${result.os.name}` : "unknown device",
            browser: result.browser.name ?? "unknown",
            os: result.os.name || "unknown",
            ipAddress: req.ip || "unknown",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })

        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

        await User.populate(user, {
            path: "currentOrg",
            select: "organizationName currency logo.url"
        })

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

        return sendResponse(res, { status: 200, message: "Signed in successfully", data: { userData } })
    } catch (error) {
        console.error("Failed to sign in:", error)
        return sendResponse(res, { status: 500, message: "Failed to sign in" })
    }
}

async function refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken

    try {
        if (!refreshToken) {
            return sendResponse(res, { status: 401, message: "Refresh token not found" })
        }

        const decodedToken = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET!) as { userId: string }

        const refreshTokenInDB = await RefreshToken.findOne({ token: refreshToken })

        if (!refreshTokenInDB) {
            clearAllCookies(res)
            return sendResponse(res, { status: 401, message: "Invalid refresh token" })
        }

        if (decodedToken.userId !== refreshTokenInDB.user.toString()) {
            clearAllCookies(res)
            return sendResponse(res, { status: 401, message: "Invalid refresh token" })
        }

        const parser = new UAParser(req.headers["user-agent"])
        const result = parser.getResult()

        const newAccessToken = generateAccessToken(refreshTokenInDB.user.toString())
        const newRefreshToken = generateRefreshToken(refreshTokenInDB.user.toString())

        refreshTokenInDB.token = newRefreshToken
        refreshTokenInDB.deviceName = result.browser.name && result.os.name ? `${result.browser.name} on ${result.os.name}` : "unknown device"
        refreshTokenInDB.browser = result.browser.name || "unknown"
        refreshTokenInDB.os = result.os.name || "unknown"
        refreshTokenInDB.ipAddress = req.ip || "unknown"
        refreshTokenInDB.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        refreshTokenInDB.lastUsedAt = new Date()

        await refreshTokenInDB.save()

        res.cookie("accessToken", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
        res.cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 })

        return sendResponse(res, { status: 200, message: "Refresh token updated successfully" })

    } catch (error) {
        console.error("Failed to update refresh token:", error)

        clearAllCookies(res)
        await RefreshToken.deleteOne({ token: refreshToken })

        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            return sendResponse(res, { status: 401, message: "Invalid or expired refresh token" })
        }

        return sendResponse(res, { status: 500, message: "Failed to update refresh token" })
    }
}

export { signup, verifyCode, signin, refreshToken }