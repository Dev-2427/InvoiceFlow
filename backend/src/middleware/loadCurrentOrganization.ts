import type { Request, Response, NextFunction } from "express";
import sendResponse from "../utils/sendResponse.js";
import User from "../models/User.js";

declare global {
    namespace Express {
        interface Request {
            organization?: {
                organizationId: string
            }
        }
    }
}

export default async function (req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.userId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const user = await User.findById(userId).select("currentOrg").lean()

        if (!user) {
            return sendResponse(res, { status: 404, message: "User not found" })
        }

        if (!user.currentOrg) {
            return sendResponse(res, { status: 400, message: "No organization selected" })
        }

        req.organization = {
            organizationId: user.currentOrg.toString()
        }

        next()
    } catch (error) {
        console.error("Failed to load current organization", error);
        return sendResponse(res, { status: 500, message: "Failed to verify current organization" })
    }
}