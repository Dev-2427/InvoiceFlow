import type { Request, Response } from "express";
import { getReportsSchema } from "../validations/reports.validation.js";
import sendResponse from "../utils/sendResponse.js";
import mongoose, { type QueryFilter } from "mongoose";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { addDays, addMonths, addWeeks, addYears, startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import type { IInvoice } from "../models/Invoice.js";
import Invoice from "../models/Invoice.js";

async function getReports(req: Request, res: Response) {

    const organizationId = req.organization?.organizationId
    const passedQuery = getReportsSchema.safeParse(req.query)

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!passedQuery.success) {
        return sendResponse(res, { status: 400, message: "Invalid query" })
    }

    try {

        const { clientId, dateRange, from, to, timeZone, status, limit, page } = passedQuery.data

        const skip = (page - 1) * limit

        const validOrganizatioId = new mongoose.Types.ObjectId(organizationId)

        const query: QueryFilter<IInvoice> = {
            organization: validOrganizatioId,
            isDeleted: false
        }

        const now = new Date()
        const localNow = toZonedTime(now, timeZone)

        let startDate: Date;
        let endDate: Date;

        if (dateRange === "custom") {
            if (from === null || to === null) {
                return sendResponse(res, { status: 400, message: "Dates are required for custom date range" })
            }
            startDate = startOfDay(from)
            endDate = addDays(startOfDay(to), 1)
        } else if (dateRange === "today") {
            startDate = startOfDay(localNow)
            endDate = addDays(startDate, 1)
        } else if (dateRange === "this_week") {
            startDate = startOfWeek(localNow)
            endDate = addWeeks(startDate, 1)
        } else if (dateRange === "this_month") {
            startDate = startOfMonth(localNow)
            endDate = addMonths(startDate, 1)
        } else {
            startDate = startOfYear(localNow)
            endDate = addYears(startDate, 1)
        }

        query.issueDate = { $gte: fromZonedTime(startDate, timeZone), $lt: fromZonedTime(endDate, timeZone) }

        if (clientId) {
            query.client = new mongoose.Types.ObjectId(clientId)
        }

        if (status !== "all") {
            query.status = status
        }


        const reportData = await Invoice.aggregate([
            {
                $match: query
            },
            {
                $lookup: {
                    from: "clients",
                    foreignField: "_id",
                    localField: "client",
                    as: "client"
                }
            },
            {
                $unwind: "$client"
            },
            {
                $project: {
                    invoiceNumber: 1,
                    status: 1,
                    totalAmount: 1,
                    issueDate: 1,
                    dueDate: 1,
                    createdAt: 1,
                    client: {
                        displayName: 1,
                        companyName: 1
                    }
                }
            },
            {
                $facet: {
                    invoices: [
                        { $sort: { createdAt: -1 } },
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    count: [
                        { $count: "totalInvoices" }
                    ],
                    totalCollected: [
                        {
                            $group: {
                                _id: null,
                                totalCollected: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: ["$status", "paid"]
                                            },
                                            "$totalAmount",
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    ],
                    totalOverdue: [
                        {
                            $group: {
                                _id: null,
                                totalOverdue: {
                                    $sum: {
                                        $cond: [
                                            {
                                                $eq: ["$status", "overdue"]
                                            },
                                            "$totalAmount",
                                            0
                                        ]
                                    }
                                }
                            }
                        }
                    ],
                    invoicesCountsByStatus: [
                        {
                            $group: {
                                _id: "$status",
                                count: {
                                    $sum: 1
                                }
                            }
                        }
                    ],
                    totalRevenue: [
                        {
                            $match: {
                                status: { $ne: "draft" }
                            }
                        },
                        {
                            $group: {
                                _id: null,
                                totalRevenue: {
                                    $sum: "$totalAmount"
                                }
                            }
                        }
                    ]
                }
            }
        ])

        const report = reportData[0] ?? {
            invoices: [],
            count: [],
            totalCollected: [],
            totalOverdue: [],
            totalRevenue: [],
            invoicesCountsByStatus: []
        }

        type InvoiceStatus = "paid" | "unpaid" | "overdue" | "draft"

        const invoicesCountsByStatus = {
            paid: 0,
            unpaid: 0,
            overdue: 0,
            draft: 0
        }

        for (const item of report.invoicesCountsByStatus) {
            invoicesCountsByStatus[item._id as InvoiceStatus] = item.count
        }

        if (status === "all") {
            invoicesCountsByStatus.unpaid += invoicesCountsByStatus.overdue
        }

        const finalReportData = {
            invoices: report.invoices ?? [],
            totalInvoices: report.count[0]?.totalInvoices ?? 0,
            totalCollected: report.totalCollected[0]?.totalCollected ?? 0,
            totalOverdue: report.totalOverdue[0]?.totalOverdue ?? 0,
            totalRevenue: report.totalRevenue[0]?.totalRevenue ?? 0,
            invoicesCountsByStatus: invoicesCountsByStatus
        }

        return sendResponse(res, {
            status: 200, message: "Report data fetched successfully", data: {
                reportData: finalReportData,
                pagination: {
                    page,
                    limit,
                    totalItems: finalReportData.totalInvoices,
                    totalPages: Math.ceil(finalReportData.totalInvoices / limit),
                }
            }
        })

    } catch (error) {
        console.error("Failed to fetch report:", error)
        return sendResponse(res, { status: 500, message: "Failed to fetch report" })
    }
}

export { getReports }