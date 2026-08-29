import type { Request, Response } from "express";
import sendResponse from "../utils/sendResponse.js";
import User from "../models/User.js";
import Client, { type IClient } from "../models/Client.js";
import mongoose, { Types } from "mongoose";
import { completeClientSchema, getClientsSchema, searchClientSchema } from "../validations/client.validation.js";
import Invoice from "../models/Invoice.js";
import type { QueryFilter } from "mongoose"

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

        return sendResponse(res, { status: 201, message: "Client created successfully", data: { clientId: client._id } })

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

async function updateClient(req: Request<clientParams>, res: Response) {
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
        })

        if (!client) {
            return sendResponse(res, { status: 404, message: "Client not found" })
        }

        const finalData = {
            ...client.toObject(),
            ...req.body
        }

        const result = completeClientSchema.safeParse(finalData)

        if (!result.success) {
            return sendResponse(res, { status: 400, message: result.error.issues[0]?.message ?? "Validation failed" })
        }

        Object.assign(client, result.data)
        await client.save()

        return sendResponse(res, { status: 200, message: "Client updated successfully", data: { clientId: client._id } })
    } catch (error) {
        if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
            return sendResponse(res, { status: 409, message: "A client with this display name already exists" })
        }

        console.error("Failed to update client:", error);
        return sendResponse(res, { status: 500, message: "Failed to update client" })
    }
}

async function deleteClients(req: Request, res: Response) {
    const organizationId = req.organization?.organizationId
    const { clientIds } = req.body

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()

        const clients = await Client.deleteMany({
            organization: organizationId,
            _id: { $in: clientIds }
        }).session(session)

        if (clients.deletedCount !== clientIds.length) {
            await session.abortTransaction()
            return sendResponse(res, { status: 404, message: "One or more clients were not found" })
        }

        await Invoice.deleteMany({
            organization: organizationId,
            client: { $in: clientIds }
        }).session(session)

        await session.commitTransaction()

        return sendResponse(res, { status: 200, message: "Clients deleted successfully" })
    } catch (error) {
        await session.abortTransaction()
        console.error("Failed to delete clients:", error);
        return sendResponse(res, { status: 500, message: "Failed to delete clients" })
    } finally {
        await session.endSession()
    }
}

async function changeClientStatus(req: Request, res: Response) {
    const organizationId = req.organization?.organizationId
    const { clientIds, status } = req.body

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {

        const result = await Client.updateMany({
            organization: organizationId,
            _id: { $in: clientIds }
        }, {
            status
        })

        if (result.matchedCount === 0) {
            return sendResponse(res, { status: 404, message: "No clients found" })
        }

        return sendResponse(res, { status: 200, message: "Client status updated successfully" })
    } catch (error) {
        console.error("Failed to update client status:", error);
        return sendResponse(res, { status: 500, message: "Failed to update client status" })
    }
}

async function getClients(req: Request, res: Response) {
    const passedQuery = getClientsSchema.safeParse(req.query)
    const organizationId = req.organization?.organizationId

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!passedQuery.success) {
        return sendResponse(res, { status: 400, message: "Invalid queries" })
    }

    try {

        const { limit, order, page, sortBy, filter, search } = passedQuery.data

        const skip = (page - 1) * limit

        const query: QueryFilter<IClient> = { organization: new Types.ObjectId(organizationId) }

        if (filter === "active" || filter === "inactive") {
            query.status = filter
        } else if (filter === "business" || filter === "individual") {
            query.clientType = filter
        }


        if (search) {
            query.$or = [
                { displayName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
            ]
        }

        const sort: Record<string, 1 | -1> = { [sortBy]: order === "asc" ? 1 : -1 }

        const [clients, totalItems] = await Promise.all([
            Client.aggregate([
                { $match: query },
                { $sort: sort },
                { $skip: skip },
                { $limit: limit },
                {
                    $project: {
                        organization: 1,
                        displayName: 1,
                        companyName: 1,
                        email: 1,
                        phone: 1
                    }
                },
                {
                    $lookup: {
                        from: "invoices",
                        let: {
                            clientId: "$_id",
                            organizationId: "$organization"
                        },

                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$client", "$$clientId"] },
                                            { $eq: ["$organization", "$$organizationId"] }
                                        ]
                                    }
                                }
                            },
                            {

                                $group: {
                                    _id: null,

                                    totalBilled: {
                                        $sum: "$totalAmount"
                                    },

                                    totalReceivable: {
                                        $sum: {
                                            $cond: [
                                                {
                                                    $in: [
                                                        "$status",
                                                        ["unpaid", "overdue"]
                                                    ]
                                                },
                                                "$totalAmount",
                                                0
                                            ]
                                        }
                                    }
                                }
                            },
                        ],
                        as: "stats"
                    }
                },
                {
                    $unwind: {
                        path: "$stats",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        totalBilled: {
                            $ifNull: ["$stats.totalBilled", 0]
                        },
                        totalReceivable: {
                            $ifNull: ["$stats.totalReceivable", 0]
                        },
                    }
                },
                {
                    $project: {
                        stats: 0,
                        organization: 0
                    }
                }
            ]),

            Client.countDocuments(query)
        ])

        return sendResponse(res, {
            status: 200, message: "Clients fetched successfully", data: {
                clients,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit)
                }
            }
        })

    } catch (error) {
        console.error("Failed to get client:", error);
        return sendResponse(res, { status: 500, message: "Failed to get clients" })
    }

}

async function searchClient(req: Request, res: Response) {

    const organizationId = req.organization?.organizationId

    const passedQuery = searchClientSchema.safeParse(req.query)

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!passedQuery.success) {
        return sendResponse(res, { status: 400, message: "Invalid query" })
    }

    const { search } = passedQuery.data

    const compatibleOrganizationId = new mongoose.Types.ObjectId(organizationId)

    try {
        const clients = await Client.aggregate([
            {
                $match: {
                    organization: compatibleOrganizationId,
                    $or: [
                        { displayName: { $regex: search, $options: "i" } },
                        { companyName: { $regex: search, $options: "i" } }
                    ]
                }
            },
            { $limit: 10 },
            {
                $lookup: {
                    from: "invoices",
                    let: { clientId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$client", "$$clientId"] },
                                        { $in: ["$status", ["unpaid", "overdue"]] },
                                        { $eq: ["$isDeleted", false] }
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                receivable: { $sum: "$totalAmount" }
                            }
                        }
                    ],
                    as: "receivableData"
                }
            },
            {
                $project: {
                    clientType: 1,
                    companyName: 1,
                    displayName: 1,
                    salutation: 1,
                    email: 1,
                    phone: 1,
                    status: 1,
                    city: "$billingAddress.city",
                    receivable: {
                        $ifNull: [
                            { $arrayElemAt: ["$receivableData.receivable", 0] },
                            0
                        ]
                    }
                }
            }

        ])

        return sendResponse(res, { status: 200, message: "Searched clients fetched successfully", data: { searchedClients: clients } })


    } catch (error) {
        console.error("Failed to fetch searched clients:", error)
        return sendResponse(res, { status: 500, message: "Failed to fetch searched clients" })
    }
}

export { createClient, getClientDetails, updateClient, deleteClients, changeClientStatus, getClients, searchClient }