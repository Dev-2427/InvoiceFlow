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

export interface getSoftDeletedInvoiceParams {
    page: number,
    limit: number
}

export interface getSoftDeletedInvoicesResponseData {
    invoices: {
        _id: string
        client: {
            displayName: string,
            companyName: string | null
        },
        currency: {
            code: string,
            symbol: string
        },
        deletedAt: string,
        issueDate: string,
        dueDate: string,
        invoiceNumber: string,
        status: "paid" | "unpaid" | "overdue" | "draft",
        totalAmount: number
    }[],
    pagination: {
        page: number,
        limit: number,
        totalPages: number,
        totalItems: number,
    }
}

export interface GetInvoiceOverviewData {
    client: {
        _id: string,
        displayName: string,
        companyName: string
    },
    createdAt: string,
    currency: {
        code: string,
        symbol: string
    },
    deletedAt: string,
    discountAmount: number,
    discountValue: number,
    dueDate: string,
    email: { sent: boolean, sentAt: string | null, sentTo: string | null },
    invoiceNumber: string,
    isDeleted: boolean,
    issueDate: string,
    lineItems: {
        description: string,
        quantity: number,
        rate: number,
        amount: number,
        _id: string
    }[],
    notes: string,
    organization: string,
    payment: {
        mode: PaymentModeType | null,
        amount: number | null,
        note: string,
        receivedDate: string | null
    },
    showLogo: boolean,
    status: "paid" | "unpaid" | "overdue" | "draft",
    subtotal: number,
    taxValue: number,
    taxAmount: number,
    totalAmount: number,
    updatedAt: string,
    _id: string
}

export interface InvoiceListData {
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
    deletedCount?: number

}