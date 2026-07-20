import type { Request, Response } from "express";
import sendResponse from "../utils/sendResponse.js";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import mongoose from "mongoose";
import { currencies } from "../config/constants.js";

async function createOrganization(req: Request, res: Response) {
    const { organizationName, email, phone, gstNumber, currencyCode, address, termsAndConditions } = req.body
    const userId = req.user?.userId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    const selectedCurrency = currencies.find((currency) => currency.code === currencyCode)

    if (!selectedCurrency) {
        return sendResponse(res, { status: 400, message: "Invalid currency" })
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const user = await User.findById(userId).session(session)

        if (!user) {
            return sendResponse(res, { status: 401, message: "User not found" })
        }


        const organization = new Organization({
            owner: userId,
            organizationName,
            email,
            phone: phone ?? null,
            gstNumber: gstNumber ?? null,
            currency: { code: selectedCurrency.code, symbol: selectedCurrency.symbol },
            address,
            termsAndConditions: termsAndConditions ?? ""
        })

        await organization.save({ session })

        user.currentOrg = organization._id
        await user.save({ session })

        await session.commitTransaction()

        const organizationData = {
            id: organization._id.toString(),
            organizationName: organization.organizationName,
            email: organization.email,
            phone: organization.phone,
            gstNumber: organization.gstNumber,
            currency: organization.currency,
            address: organization.address,
            termsAndConditions: organization.termsAndConditions
        }

        return sendResponse(res, { status: 201, message: "Organization created successfully", data: { organizationData } })

    } catch (error) {
        await session.abortTransaction()

        const mongoError = error as { code?: number }
        if (mongoError.code === 11000) {
            return sendResponse(res, {
                status: 409,
                message: "You already have an organization with this name."
            })
        }

        console.error("Error creating organization:", error)
        return sendResponse(res, { status: 500, message: "Failed to create organization" })
    } finally {
        await session.endSession()
    }
}

export { createOrganization }