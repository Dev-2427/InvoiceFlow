import type { Request } from "express";
import { UAParser } from "ua-parser-js";

export function getDeviceDetails(req: Request) {
    const parser = new UAParser(req.headers["user-agent"])
    return parser.getResult()
}