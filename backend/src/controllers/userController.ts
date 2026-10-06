import type { Request, Response } from "express"
import sendResponse from "../utils/sendResponse.js"
import User from "../models/User.js"
import crypto from "crypto";
import imagekit from "../services/imagekit.js";

async function updateProfile(req: Request, res: Response) {
    const { firstName, lastName, country } = req.body
    const userId = req.user?.userId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const user = await User.findByIdAndUpdate(userId,
            {
                firstName,
                lastName: lastName || "",
                country: country || null
            }
        ).lean()

        if (!user) {
            return sendResponse(res, { status: 404, message: "User not found" })
        }

        return sendResponse(res, { status: 200, message: "Profile updated successfully" })

    } catch (error) {
        console.error("Error updating profile:", error)
        return sendResponse(res, { status: 500, message: "Error updating profile" })
    }

}

async function updateAvatar(req: Request, res: Response) {
    const userId = req.user?.userId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!req.file) {
        return sendResponse(res, { status: 400, message: "Avatar file is required" })
    }

    let uploadedAvatarId: string | null = null

    try {
        const user = await User.findById(userId)

        if (!user) {
            return sendResponse(res, { status: 404, message: "User not found" })
        }

        let ext = "jpg"

        if (req.file.mimetype.endsWith("jpeg")) ext = "jpeg"
        if (req.file.mimetype.endsWith("png")) ext = "png"
        if (req.file.mimetype.endsWith("webp")) ext = "webp"

        const fileName = `avatar-${userId}-${crypto.randomBytes(3).toString("hex")}-${Date.now()}.${ext}`

        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName,
            folder: "/user-avatars",
            useUniqueFileName: false,
        })

        uploadedAvatarId = uploadResponse.fileId

        let deletableFileId = user.avatar.fileId || null

        user.avatar = {
            url: uploadResponse.url,
            fileId: uploadResponse.fileId
        }

        await user.save()

        if (deletableFileId) {
            try {
                await imagekit.deleteFile(deletableFileId)
            } catch (error) {
                console.error("Failed to delete old avatar:", error)
            }
        }

        return sendResponse(res, { status: 200, message: "Avatar updated successfully", data: { avatar: user.avatar.url } })

    } catch (error) {

        if (uploadedAvatarId) {
            try {
                await imagekit.deleteFile(uploadedAvatarId)
            } catch (cleanupError) {
                console.error("Failed to clean up orphan image:", cleanupError);
            }
        }

        console.error("Error updating avatar:", error)
        return sendResponse(res, { status: 500, message: "Error updating avatar" })
    }
}

async function removeAvatar(req: Request, res: Response) {
    const userId = req.user?.userId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const user = await User.findById(userId)

        if (!user) {
            return sendResponse(res, { status: 404, message: "User not found" })
        }

        if (user.avatar.fileId) {
            try {
                await imagekit.deleteFile(user.avatar.fileId)
            } catch (error) {
                console.error("Error deleting avatar from imagekit:", error)
                return sendResponse(res, { status: 500, message: " Error occured while removing avatar" })
            }
        } else {
            return sendResponse(res, { status: 404, message: "Avatar not found" })
        }

        user.avatar.fileId = null
        user.avatar.url = null

        await user.save()

        return sendResponse(res, { status: 200, message: "Avatar removed successfully" })
    } catch (error) {
        console.error("Failed to remove avatar:", error)
        return sendResponse(res, { status: 500, message: "Failed to remove avatar" })
    }
}

export { updateProfile, updateAvatar, removeAvatar }