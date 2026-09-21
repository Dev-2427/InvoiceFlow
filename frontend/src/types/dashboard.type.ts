export type revenueAndReceiptsFilter = "current_year" | "previous_year" | "past_12_months"

export interface DashboardParams {
    revenueFilter: revenueAndReceiptsFilter,
    timeZone: string,
    recentInvoiceLimit: number
}

export interface DashboardResponseData {
    clientOverviewData: {
        totalClients: number,
        totalClientsCreatedINCurrentMonth: number,
        totalOverdue: number,
        totalOverdueCount: number,
        totalReceivable: number,
        unpaidInvoicesCount: number,
        upcomingOverdue: {
            _id: string,
            client: {
                _id: string,
                displayName: string
            },
            totalAmount: number,
            dueDate: string,
        } | null
    },
    recentInvoices: {
        _id: string,
        client: {
            displayName: string,
            companyName: string
        },
        currency: {
            code: string,
            symbol: string
        },
        dueDate: string,
        invoiceNumber: string,
        status: string,
        totalAmount: number
    }[],
    revenueAndReceiptsData: {
        year: number,
        month: string,
        revenue: number,
        receipts: number
    }[],
    salesSummary: {
        thisMonthReceipts: number,
        thisMonthRevenue: number,
        thisQuarterReceipts: number,
        thisQuarterRevenue: number,
        thisWeekReceipts: number,
        thisWeekRevenue: number,
        thisYearReceipts: number,
        thisYearRevenue: number,
        todayReceipts: number,
        todayRevenue: number,
    }
}