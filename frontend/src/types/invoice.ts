export type PaymentModeType = "cash" | "bank_transfer" | "credit_card" | "debit_card" |
    "upi" | "cheque" | "paypal" | "other"

type InvoiceSortType = "Created (Newest)" | "Created (Oldest)" | "Due Date A-Z" | "Due Date Z-A" | "Amount (Highest)" | "Amount (Lowest)" | "Client A-Z" | "Client Z-A"

type SortField = "dueDate" | "amount" | "createdAt" | "client"

type InvoiceSortOrderType = "asc" | "desc"

export interface IInvoiceSort {
    label: InvoiceSortType,
    sort: SortField,
    order: InvoiceSortOrderType
}

export type InvoiceFilterType = "all" | "paid" | "unpaid" | "overdue" | "draft"

export interface GetInvoicesResponseData {
    invoices: {
        _id: string,
        status: "paid" | "unpaid" | "overdue" | "draft",
        issueDate: string,
        dueDate: string,
        invoiceNumber: string,
        totalAmount: number,
        currency: {
            symbol: string,
            code: string
        },
        client: {
            displayName: string,
            companyName: string | null
        }
    }[]
    pagination: {
        page: number,
        limit: number,
        totalItems: number,
        totalPages: number
    },
    deletedCount: number
}

export interface getInvoiceParams {
    sortBy: SortField,
    order: InvoiceSortOrderType,
    filter?: InvoiceFilterType
    search?: string,
    page: number,
    limit: number
}