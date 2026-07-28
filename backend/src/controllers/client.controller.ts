import type { Request, Response } from "express";
import sendResponse from "../utils/sendResponse.js";
import User from "../models/User.js";
import Client from "../models/Client.js";
import mongoose from "mongoose";

type clientParams = {
    clientId: string
}

async function createClient(req: Request, res: Response) {

    const userId = req.user?.userId
    const { clientType, salutation, firstName, lastName, companyName, displayName, email, phone, billingAddress, shippingAddress } = req.body

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

        const client = await Client.create({
            organization: user.currentOrg,
            clientType,
            salutation: salutation || null,
            firstName: firstName || null,
            lastName: lastName || null,
            companyName: companyName || null,
            displayName,
            email: email || null,
            phone: phone || null,
            billingAddress: billingAddress || null,
            shippingAddress: shippingAddress || null
        })

        return sendResponse(res, { status: 201, message: "Client created successfully", data: { clientData: client } })

    } catch (error) {
        if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
            return sendResponse(res, { status: 409, message: "A client with this display name already exists" })
        }
        console.error("Failed to create  client:", error);
        return sendResponse(res, { status: 500, message: "Failed to create a client" })
    }
}

async function getClientDetails(req: Request<clientParams>, res: Response) {

    const organizationId = req.organization?.organizationId
    const clientId = req.params.clientId

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
        return sendResponse(res, { status: 400, message: "Invalid client ID" })
    }

    try {

        const client = await Client.findOne({
            _id: clientId,
            organization: organizationId
        }).lean()

        if (!client) {
            return sendResponse(res, { status: 404, message: "Client not found" })
        }

        return sendResponse(res, { status: 200, message: "Client details fetched successfully", data: { clientData: client } })
    } catch (error) {
        console.error("Failed to get client details:", error);
        return sendResponse(res, { status: 500, message: "Failed to get client details" })
    }
}

export { createClient, getClientDetails }