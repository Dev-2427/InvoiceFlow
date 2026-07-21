import type { Request, Response } from "express";
import sendResponse from "../utils/sendResponse.js";
import User from "../models/User.js";
import Organization from "../models/Organization.js";
import mongoose from "mongoose";
import { currencies } from "../config/constants.js";

type OrganizationParams = {
    organizationId: string
}

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
            logo: organization.logo.url,
            email: organization.email,
            phone: organization.phone,
            gstNumber: organization.gstNumber,
            currency: organization.currency,
            address: organization.address,
            termsAndConditions: organization.termsAndConditions,
            createdAt: organization.createdAt
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

async function getOrganization(req: Request<OrganizationParams>, res: Response) {

    const organizationId = req.params.organizationId
    const userId = req.user?.userId

    if (!organizationId) {
        return sendResponse(res, { status: 400, message: "Organization ID not found" })
    }

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        return sendResponse(res, {
            status: 400,
            message: "Invalid organization ID"
        });
    }

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const organization = await Organization.findOne({
            _id: organizationId,
            owner: userId
        })
            .select("organizationName logo.url email phone gstNumber currency address termsAndConditions createdAt")
            .lean()

        if (!organization) {
            return sendResponse(res, { status: 404, message: "Organization not found" })
        }

        return sendResponse(res, { status: 200, message: "Organization fetched successfully", data: { organizationData: organization } })
    } catch (error) {
        console.error("Failed to get organization data:", error)
        return sendResponse(res, { status: 500, message: "Failed to get organization data" })
    }
}

async function getOrganizations(req: Request, res: Response) {

    const userId = req.user?.userId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const organizations = await Organization.find({ owner: userId })
            .select("organizationName logo.url currency createdAt")
            .sort({ createdAt: -1 })
            .lean()


        return sendResponse(res, { status: 200, message: "Organizations fetched successfully", data: { organizations } })

    } catch (error) {
        console.error("Failed to fetch user's organizations:", error)
        return sendResponse(res, { status: 500, message: "Failed to fetch user's organizations" })
    }

}

async function updateOrganization(req: Request<OrganizationParams>, res: Response) {
    const userId = req.user?.userId
    const organizationId = req.params.organizationId

    if (!userId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        return sendResponse(res, {
            status: 400,
            message: "Invalid organization ID"
        });
    }

    try {
        const updatedOrganization = await Organization.findOneAndUpdate(
            { _id: organizationId, owner: userId },
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        )
            .select("organizationName logo.url email phone gstNumber currency address termsAndConditions createdAt")
            .lean()

        if (!updatedOrganization) {
            return sendResponse(res, { status: 404, message: "Organization not found" })
        }

        return sendResponse(res, { status: 200, message: "Organization updated successfully", data: { organizationData: updatedOrganization } })

    } catch (error) {
        const mongoError = error as { code?: number };

        if (mongoError.code === 11000) {
            return sendResponse(res, {
                status: 409,
                message: "Organization name already exists"
            });
        }

        console.error("Failed to update organization data:", error);
        return sendResponse(res, { status: 500, message: "Failed to update organization data" })
    }
}

export { createOrganization, getOrganization, getOrganizations, updateOrganization }