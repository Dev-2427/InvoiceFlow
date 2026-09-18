import type { Request, Response } from "express";
import { getDashboardDataSchema } from "../validations/dashboard.validation.js";
import sendResponse from "../utils/sendResponse.js";
import Invoice from "../models/Invoice.js";
import mongoose from "mongoose";
import Client from "../models/Client.js";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { addDays, addMonths, addQuarters, addWeeks, addYears, startOfDay, startOfMonth, startOfQuarter, startOfWeek, startOfYear } from "date-fns";

async function getDashboardData(req: Request, res: Response) {

    const organizationId = req.organization?.organizationId
    const passedQuery = getDashboardDataSchema.safeParse(req.query)

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!passedQuery.success) {
        return sendResponse(res, { status: 400, message: "Invalid query" })
    }

    try {

        const { revenueFilter, timeZone, recentInvoicesLimit } = passedQuery.data

        const now = new Date()

        const localNow = toZonedTime(now, timeZone)

        const localStartOfDay = startOfDay(localNow)
        const startOfDayUtc = fromZonedTime(localStartOfDay, timeZone)

        const localStartOfMonth = startOfMonth(localNow)
        const startOfMonthUtc = fromZonedTime(localStartOfMonth, timeZone)

        const validOrganizationId = new mongoose.Types.ObjectId(organizationId)



        let startDate: Date;
        let endDate: Date;

        if (revenueFilter === "current_year") {
            startDate = startOfYear(localNow)
            endDate = addYears(startDate, 1)
        } else if (revenueFilter === "previous_year") {
            endDate = startOfYear(localNow)
            startDate = addYears(endDate, -1)
        } else {
            startDate = addMonths(startOfMonth(localNow), -11)
            endDate = addMonths(startOfMonth(localNow), 1)
        }

        const startDateUtc = fromZonedTime(startDate, timeZone)
        const endDateUtc = fromZonedTime(endDate, timeZone)



        const todayStart = startOfDay(localNow)
        const todayEnd = addDays(todayStart, 1)

        const weekStart = startOfWeek(localNow, { weekStartsOn: 1 })
        const weekEnd = addWeeks(weekStart, 1)

        const monthStart = startOfMonth(localNow)
        const monthEnd = addMonths(monthStart, 1)

        const quarterStart = startOfQuarter(localNow)
        const quarterEnd = addQuarters(quarterStart, 1)

        const yearStart = startOfYear(localNow)
        const yearEnd = addYears(yearStart, 1)

        const periods = {
            today: {
                start: fromZonedTime(todayStart, timeZone),
                end: fromZonedTime(todayEnd, timeZone),
            },
            thisWeek: {
                start: fromZonedTime(weekStart, timeZone),
                end: fromZonedTime(weekEnd, timeZone),
            },
            thisMonth: {
                start: fromZonedTime(monthStart, timeZone),
                end: fromZonedTime(monthEnd, timeZone),
            },
            thisQuarter: {
                start: fromZonedTime(quarterStart, timeZone),
                end: fromZonedTime(quarterEnd, timeZone),
            },
            thisYear: {
                start: fromZonedTime(yearStart, timeZone),
                end: fromZonedTime(yearEnd, timeZone),
            },
        }

        const [overviewData, upcomingOverdue, totalClients, totalClientsCreatedINCurrentMonth, revenue, receipts, salesSummary, recentInvoices] = await Promise.all([
            // overview details
            Invoice.aggregate([
                {
                    $match: {
                        organization: validOrganizationId,
                        isDeleted: false,
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalReceivable: {
                            $sum: {
                                $cond: [
                                    { $in: ["$status", ["unpaid", "overdue"]] },
                                    "$totalAmount",
                                    0
                                ]
                            }
                        },
                        unpaidInvoicesCount: {
                            $sum: {
                                $cond: [
                                    { $in: ["$status", ["unpaid", "overdue"]] },
                                    1,
                                    0
                                ]
                            }
                        },
                        totalOverdue: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "overdue"] },
                                    "$totalAmount",
                                    0
                                ]
                            }
                        },
                        totalOverdueCount: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "overdue"] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ]),

            Invoice.findOne({
                organization: validOrganizationId,
                isDeleted: false,
                status: "unpaid",
                dueDate: { $gt: startOfDayUtc }
            })
                .sort({ dueDate: 1 })
                .select("totalAmount dueDate client")
                .populate("client", "displayName")
                .lean()
            ,

            Client.countDocuments({
                organization: validOrganizationId
            }),

            Client.countDocuments({
                organization: validOrganizationId,
                createdAt: { $gte: startOfMonthUtc }
            }),

            //revenue and receipts

            // revenue
            Invoice.aggregate([
                {
                    $match: {
                        organization: validOrganizationId,
                        isDeleted: false,
                        status: { $ne: "draft" },
                        issueDate: {
                            $gte: startDateUtc,
                            $lt: endDateUtc
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$issueDate" },
                            month: { $month: "$issueDate" }
                        },
                        revenue: {
                            $sum: "$totalAmount"
                        }

                    }
                }
            ]),

            // receipts
            Invoice.aggregate([
                {
                    $match: {
                        organization: validOrganizationId,
                        isDeleted: false,
                        status: "paid",
                        "payment.receivedDate": {
                            $gte: startDateUtc,
                            $lt: endDateUtc
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$payment.receivedDate" },
                            month: { $month: "$payment.receivedDate" }
                        },
                        receipts: {
                            $sum: "$payment.amount"
                        }
                    }
                }
            ]),

            //sales summary
            Invoice.aggregate([
                {
                    $match: {
                        organization: validOrganizationId,
                        isDeleted: false,
                        status: { $ne: "draft" }
                    }
                },
                {
                    $group: {
                        _id: null,

                        todayRevenue: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$issueDate", periods.today.start] },
                                            { $lt: ["$issueDate", periods.today.end] }
                                        ]
                                    },
                                    "$totalAmount",
                                    0
                                ]
                            }
                        },

                        todayReceipts: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$payment.receivedDate", periods.today.start] },
                                            { $lt: ["$payment.receivedDate", periods.today.end] }
                                        ]
                                    },
                                    "$payment.amount",
                                    0
                                ]
                            }
                        },

                        thisWeekRevenue: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$issueDate", periods.thisWeek.start] },
                                            { $lt: ["$issueDate", periods.thisWeek.end] }
                                        ]
                                    },
                                    "$totalAmount",
                                    0
                                ]
                            }
                        },

                        thisWeekReceipts: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$payment.receivedDate", periods.thisWeek.start] },
                                            { $lt: ["$payment.receivedDate", periods.thisWeek.end] }
                                        ]
                                    },
                                    "$payment.amount",
                                    0
                                ]
                            }
                        },

                        thisMonthRevenue: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$issueDate", periods.thisMonth.start] },
                                            { $lt: ["$issueDate", periods.thisMonth.end] },
                                        ]
                                    },
                                    "$totalAmount",
                                    0
                                ]
                            }
                        },

                        thisMonthReceipts: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$payment.receivedDate", periods.thisMonth.start] },
                                            { $lt: ["$payment.receivedDate", periods.thisMonth.end] },
                                        ]
                                    },
                                    "$payment.amount",
                                    0
                                ]
                            }
                        },

                        thisQuarterRevenue: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$issueDate", periods.thisQuarter.start] },
                                            { $lt: ["$issueDate", periods.thisQuarter.end] },
                                        ]
                                    },
                                    "$totalAmount",
                                    0
                                ]
                            }
                        },

                        thisQuarterReceipts: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$payment.receivedDate", periods.thisQuarter.start] },
                                            { $lt: ["$payment.receivedDate", periods.thisQuarter.end] },
                                        ]
                                    },
                                    "$payment.amount",
                                    0
                                ]
                            }
                        },

                        thisYearRevenue: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$issueDate", periods.thisYear.start] },
                                            { $lt: ["$issueDate", periods.thisYear.end] }
                                        ]
                                    },
                                    "$totalAmount",
                                    0
                                ]
                            }
                        },

                        thisYearReceipts: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$payment.receivedDate", periods.thisYear.start] },
                                            { $lt: ["$payment.receivedDate", periods.thisYear.end] }
                                        ]
                                    },
                                    "$payment.amount",
                                    0
                                ]
                            }
                        }
                    }
                }
            ]),

            //recent invoices
            Invoice.find({
                organization: validOrganizationId,
                isDeleted: false
            })
                .select("invoiceNumber totalAmount currency dueDate status")
                .sort({ issueDate: -1 })
                .limit(recentInvoicesLimit)
                .populate("client", "displayName companyName -_id")
        ])

        const CompleteOverviewData = {
            ...(overviewData[0] ?? {
                totalReceivable: 0,
                unpaidInvoicesCount: 0,
                totalOverdue: 0,
                totalOverdueCount: 0
            }),
            upcomingOverdue,
            totalClients,
            totalClientsCreatedINCurrentMonth
        }

        const monthlyRevenueReceipts = Array.from({ length: 12 }, (_, index) => {
            const monthDate = addMonths(startOfMonth(startDate), index)

            const year = monthDate.getFullYear()
            const month = monthDate.getMonth() + 1

            const revenueData = revenue.find(
                (item) =>
                    item._id.year === year &&
                    item._id.month === month
            )

            const receiptData = receipts.find(
                (item) =>
                    item._id.year === year &&
                    item._id.month === month
            )

            return {
                year,
                month: monthDate.toLocaleString("en-US", { month: "short" }),
                revenue: revenueData?.revenue ?? 0,
                receipts: receiptData?.receipts ?? 0
            }
        })

        return sendResponse(res, {
            status: 200, message: "Dashboard data fetched successfully", data: {
                clientOverviewData: CompleteOverviewData,
                revenueAndReceiptsData: monthlyRevenueReceipts,
                salesSummary,
                recentInvoices
            }
        })
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        return sendResponse(res, { status: 500, message: "Failed to fetch dashboard data" })
    }
}

export { getDashboardData }