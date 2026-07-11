import type { Response } from "express";

interface IResponseOptions {
    status: number,
    message: string,
    data?: object | null
}

export default function sendResponse(res: Response, options: IResponseOptions) {
    return res.status(options.status).json({ success: options.status < 400, message: options.message, data: options.data })
}