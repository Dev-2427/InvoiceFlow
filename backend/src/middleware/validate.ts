import type { Request, Response, NextFunction } from "express"
import sendResponse from "../utils/sendResponse.js";
import type { ZodType } from "zod"

export default function validate(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            return sendResponse(res, { status: 400, message: result.error.issues[0]?.message || "Validation failed" })
        }

        req.body = result.data
        next()
    }
}