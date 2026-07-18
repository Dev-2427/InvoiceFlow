import type { Request, Response } from "express"
import sendResponse from "../utils/sendResponse.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import sendEmail from "../services/email/sendEmail.js"
import verificationTemplate from "../services/email/templates/verification.js"
import { generateAccessToken, generateRefreshToken, cookieOptions, clearAllCookies } from "../services/auth.service.js"
import RefreshToken from "../models/RefreshToken.js"
import jwt from "jsonwebtoken"
import { env } from "../config/env.js"
import Organization from "../models/Organization.js"
import forgotPasswordVerificationTemplate from "../services/email/templates/forgotPasswordVerification.js"
import { googleClient } from "../config/google.js"
import { getDeviceDetails } from "../utils/getDeviceDetails.js"
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../config/constants.js"

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

        let userId: string

        if (existingUser && !existingUser.isVerified) {
            existingUser.firstName = firstName
            existingUser.lastName = lastName || ""
            existingUser.password = hashedPassword
            existingUser.country = country || null
            existingUser.verificationCode = newVerificationCode
            existingUser.verificationCodeExpiresAt = verificationCodeExpiry

            await existingUser.save()
            userId = existingUser._id.toString()
        } else {
            const newUser = await User.create({
                firstName,
                lastName: lastName || "",
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

        const result = getDeviceDetails(req)

        await RefreshToken.create({
            user: userId,
            token: refreshToken,
            deviceName: result.browser.name && result.os.name ? `${result.browser.name} on ${result.os.name}` : "unknown device",
            browser: result.browser.name ?? "unknown",
            os: result.os.name || "unknown",
            ipAddress: req.ip || "unknown",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })

        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE })
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE })

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

        const result = getDeviceDetails(req)

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

        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE })
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE })

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

        const result = getDeviceDetails(req)

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

        res.cookie("accessToken", newAccessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE })
        res.cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE })

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

async function signout(req: Request, res: Response) {
    const userId = req.user?.userId
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken || !userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const deleteRefreshToken = await RefreshToken.deleteOne({
            token: refreshToken,
            user: userId
        })

        clearAllCookies(res)

        if (deleteRefreshToken.deletedCount === 0) {
            return sendResponse(res, { status: 401, message: "Token not found" })
        }

        return sendResponse(res, { status: 200, message: "Logged out successfully" })
    } catch (error) {
        console.error("Error on logout:", error)
        return sendResponse(res, { status: 500, message: "Log out failed" })
    }
}

async function signoutAllDevices(req: Request, res: Response) {
    const userId = req.user?.userId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        await RefreshToken.deleteMany({ user: userId })

        clearAllCookies(res)

        return sendResponse(res, { status: 200, message: "Successfully signed out from all devices" })

    } catch (error) {
        console.error("Failed to sign out all devices:", error)
        return sendResponse(res, { status: 500, message: "Failed to sign out all devices" })
    }


}

async function forgotPassword(req: Request, res: Response) {
    const { email } = req.body

    try {
        const user = await User.findOne({ email })

        if (!user) {
            return sendResponse(res, { status: 404, message: "Invalid email" })
        }

        if (!user.isVerified) {
            return sendResponse(res, { status: 403, message: "Account isn't verified. Please complete the sign up process." })
        }

        if (!user.authProviders.credentials) {
            return sendResponse(res, { status: 403, message: "This account was created with google. Please use google sign in" })
        }

        const passwordResetCode = Math.floor(100000 + Math.random() * 900000).toString()
        const passwordResetCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000)

        user.passwordResetCode = passwordResetCode
        user.passwordResetCodeExpiresAt = passwordResetCodeExpiresAt
        await user.save()

        try {
            await sendEmail({ to: email, subject: "Password reset verification code", html: forgotPasswordVerificationTemplate(user.firstName, passwordResetCode) })
        } catch (error) {
            console.error("Failed to send password reset email:", error)
            return sendResponse(res, { status: 500, message: "Failed to send password reset verification email" })
        }

        return sendResponse(res, { status: 200, message: "Password reset code sent successfully", data: { userId: user._id } })

    } catch (error) {
        console.error("Failed to process forgot password request", error)
        return sendResponse(res, { status: 500, message: "Failed to process forgot password request" })
    }
}

async function verifyResetCode(req: Request, res: Response) {
    const { userId, verificationCode } = req.body

    try {
        const user = await User.findById(userId)

        if (!user) {
            return sendResponse(res, { status: 404, message: "User not found" })
        }

        if (!user.isVerified) {
            return sendResponse(res, { status: 403, message: "Account isn't verified. Please complete the sign up process." })
        }

        if (!user.authProviders.credentials) {
            return sendResponse(res, { status: 403, message: "This account was created with google. Please use google sign in" })
        }

        if (user.passwordResetCodeExpiresAt && user.passwordResetCodeExpiresAt < new Date()) {
            return sendResponse(res, { status: 410, message: "Verification code has expired" })
        }

        if (user.passwordResetCode !== verificationCode) {
            return sendResponse(res, { status: 400, message: "Invalid verification code" })
        }


        user.passwordResetCode = null
        user.passwordResetCodeExpiresAt = null
        await user.save()

        const resetPasswordToken = jwt.sign(
            { userId, purpose: "RESET_PASSWORD" }, env.RESET_PASSWORD_SECRET!,
            { expiresIn: "10m" }
        )

        res.cookie("resetPasswordToken", resetPasswordToken, { ...cookieOptions, maxAge: 10 * 60 * 1000 })

        return sendResponse(res, { status: 200, message: "Code verified successfully" })
    } catch (error) {
        console.error("Failed to verify code:", error)
        return sendResponse(res, { status: 500, message: "Failed to verify code" })
    }
}

async function resetPassword(req: Request, res: Response) {
    const { password } = req.body
    const resetPasswordToken = req.cookies.resetPasswordToken

    if (!resetPasswordToken) {
        return sendResponse(res, { status: 401, message: "Token not found" })
    }

    try {
        const decodedToken = jwt.verify(resetPasswordToken, env.RESET_PASSWORD_SECRET!) as { userId: string, purpose: string }

        if (!decodedToken.userId || decodedToken.purpose !== "RESET_PASSWORD") {
            return sendResponse(res, { status: 401, message: "Invalid token" })
        }

        const user = await User.findById(decodedToken.userId)

        if (!user) {
            return sendResponse(res, { status: 401, message: "Invalid or expired token" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword
        await user.save()

        await RefreshToken.deleteMany({ user: user._id })

        res.clearCookie("resetPasswordToken", { ...cookieOptions })

        return sendResponse(res, { status: 200, message: "Password reset successfully" })

    } catch (error) {
        console.error("Failed to reset password:", error)

        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            res.clearCookie("resetPasswordToken", { ...cookieOptions });
            return sendResponse(res, { status: 401, message: "Invalid or expired token" });
        }

        return sendResponse(res, { status: 500, message: "Failed to reset password" })
    }
}

async function changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body
    const userId = req.user?.userId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const user = await User.findById(userId)

        if (!user) {
            return sendResponse(res, { status: 404, message: "User not found" })
        }

        if (!user.isVerified) {
            return sendResponse(res, { status: 403, message: "Account isn't verified. Please complete the sign up process." })
        }

        if (!user.authProviders.credentials) {
            return sendResponse(res, { status: 403, message: "This account was created with Google. Please sign in with Google." })
        }

        const correctPassword = await bcrypt.compare(oldPassword, user.password!)

        if (!correctPassword) {
            return sendResponse(res, { status: 401, message: "Invalid credentials" })
        }

        const samePassword = await bcrypt.compare(newPassword, user.password!)

        if (samePassword) {
            return sendResponse(res, { status: 400, message: "New password must be different from your current password" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        await user.save()

        await RefreshToken.deleteMany({ user: userId })

        clearAllCookies(res)

        return sendResponse(res, { status: 200, message: "Password changed successfully" })

    } catch (error) {
        console.error("Error changing password:", error)
        return sendResponse(res, { status: 500, message: "Failed to change password" })
    }
}

async function googleAuth(req: Request, res: Response) {
    const { code } = req.body

    try {

        const { tokens } = await googleClient.getToken({code, redirect_uri: "postmessage"})

        if (!tokens.id_token) {
            return sendResponse(res, { status: 401, message: "Failed to retrieve Google ID token" })
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: env.GOOGLE_CLIENT_ID!
        })

        const payload = ticket.getPayload()

        if (!payload) {
            return sendResponse(res, { status: 401, message: "Invalid Google account" })
        }

        const { sub: googleId, email, given_name, family_name, name } = payload

        if (!googleId || !email) {
            return sendResponse(res, { status: 401, message: "Google account is missing required information" })
        }

        let user = await User.findOne({
            $or: [
                { googleId },
                { email }
            ]
        })

        if (!user) {
            user = await User.create({
                firstName: given_name ?? name ?? "User",
                lastName: family_name ?? "",
                email,
                authProviders: { google: true },
                googleId,
                isVerified: true
            })
        }

        if (!user.googleId) {
            user.googleId = googleId
            user.authProviders.google = true
            user.isVerified = true
            await user.save()
        }

        const activeSessions = await RefreshToken.find({ user: user._id }).sort({ lastUsedAt: 1 })

        if (activeSessions.length >= 3) {
            await activeSessions[0]?.deleteOne()
        }

        const accessToken = generateAccessToken(user._id.toString())
        const refreshToken = generateRefreshToken(user._id.toString())

        const result = getDeviceDetails(req)

        await RefreshToken.create({
            token: refreshToken,
            user: user._id,
            browser: result.browser.name || "unknown",
            deviceName: result.browser.name && result.os.name ? `${result.browser.name} on ${result.os.name}` : "unknown",
            os: result.os.name || "unknown",
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            ipAddress: req.ip || "unknown"
        })

        res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: ACCESS_TOKEN_MAX_AGE })
        res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_MAX_AGE })

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
        console.error("Failed to authenticate with Google:", error)
        return sendResponse(res, { status: 500, message: "Failed to authenticate with Google" })
    }
}

async function me(req: Request, res: Response) {
    const userId = req.user?.userId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const user = await User.findById(userId).lean()

        if (!user) {
            return sendResponse(res, { status: 404, message: "User not found" })
        }

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

        return sendResponse(res, { status: 200, message: "Data fetched successfully", data: { userData } })
    } catch (error) {
        console.error("Error getting user data:", error)
        return sendResponse(res, { status: 500, message: "Error getting data" })
    }
}

async function signoutSession(req: Request, res: Response) {
    const userId = req.user?.userId
    const refreshToken = req.cookies.refreshToken
    const sessionId = req.params.sessionId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!refreshToken) {
        return sendResponse(res, { status: 401, message: "Access denied" })
    }

    if (!sessionId) {
        return sendResponse(res, { status: 400, message: "Session ID is required" })
    }

    try {
        const refreshTokenInDB = await RefreshToken.findOne({
            _id: sessionId,
            user: userId
        })

        if (!refreshTokenInDB) {
            return sendResponse(res, { status: 404, message: "Session not found" })
        }

        const isCurrentSession = refreshTokenInDB.token === refreshToken

        await refreshTokenInDB.deleteOne()

        if (isCurrentSession) {
            clearAllCookies(res)
        }

        return sendResponse(res, { status: 200, message: "Sign out successfully from the session" })
    } catch (error) {
        console.error("Failed to sign out from the session:", error)
        return sendResponse(res, { status: 500, message: "Failed to sign out from the session" })
    }

}

async function activeSessions(req: Request, res: Response) {
    const userId = req.user?.userId
    const refreshToken = req.cookies.refreshToken

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!refreshToken) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }
    try {
        const activeSessions = await RefreshToken.find(
            { user: userId }
        )
            .select("token deviceName browser os ipAddress lastUsedAt createdAt")
            .sort({ lastUsedAt: -1 })
            .lean()

        if (activeSessions.length === 0) {
            clearAllCookies(res)
            return sendResponse(res, { status: 401, message: "Session not found" })
        }

        const sessions = activeSessions.map((session) => ({
            sessionId: session._id.toString(),
            deviceName: session.deviceName,
            browser: session.browser,
            os: session.os,
            ipAddress: session.ipAddress,
            lastUsedAt: session.lastUsedAt,
            createdAt: session.createdAt,
            currentSession: session.token === refreshToken
        }))

        return sendResponse(res, { status: 200, message: "Active sessions fetched successfully", data: { sessions } })

    } catch (error) {
        console.error("Failed to fetch active sessions:", error)
        return sendResponse(res, { status: 500, message: "Failed to fetch active sessions" })
    }
}


export { signup, verifyCode, signin, refreshToken, signout, signoutAllDevices, forgotPassword, verifyResetCode, resetPassword, changePassword, googleAuth, me, signoutSession, activeSessions }