import type { InvoiceFilterType } from "./invoice.types"

export type DateRangeFilter = "today" | "this_month" | "this_week" | "this_year" | "custom"

export interface IDateRange {
    label: "today" | "this week" | "this month" | "this year" | "custom",
    filter: DateRangeFilter
}

export interface GetReportsParams {
    dateRange: DateRangeFilter,
    from: Date | null,
    to: Date | null,
    timeZone: string,
    clientId: string | null,
    status: InvoiceFilterType,
    page: number,
    limit: number
}

export interface GetReportsData {
    pagination: {
        page: number,
        limit: number,
        totalItems: number,
        totalPages: number
    },
    reportData: {
        invoices: {
            _id: string,
            client: {
                companyName: string | null,
                displayName: string
            },
            createdAt: string,
            issueDate: string,
            dueDate: string,
            invoiceNumber: string,
            status: "paid" | "unpaid" | "overdue" | "draft",
            totalAmount: number
        }[],
        invoicesCountsByStatus: {
            paid: number,
            unpaid: number,
            overdue: number,
            draft: number
        },
        totalCollected: number,
        totalInvoices: number,
        totalOverdue: number,
        totalRevenue: number
    }
}