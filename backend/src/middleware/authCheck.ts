import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import sendResponse from "../utils/sendResponse.js";
import { env } from "../config/env.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string
            }
        }
    }
}

export default async function authCheck(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
        return sendResponse(res, {
            status: 401, message: "Unauthorized access", data: {
                code: "AUTH_CHECK_FAILED" //for frontend axios interceptor 
            }
        })
    }

    try {
        const decodedToken = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET!) as { userId: string }

        req.user = {
            userId: decodedToken.userId
        }

        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
            return sendResponse(res, { status: 401, message: "Invalid or expired access token", data: { code: "TOKEN_EXPIRED" } })
        }

        console.error("Token verification failed:", error)
        return sendResponse(res, { status: 401, message: "Invalid or expired access token", data: { code: "INVALID_TOKEN" } })
    }
}