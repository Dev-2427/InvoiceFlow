import mongoose from "mongoose"
import z from "zod"

export const createInvoiceSchema = z.object({
    clientId: z.string().refine(mongoose.Types.ObjectId.isValid, "Invalid client ID"),
    status: z.enum(["draft", "unpaid", "paid", "overdue"]),
    issueDate: z.coerce.date(),
    dueDate: z.coerce.date(),
    lineItems: z.array(
        z.object({
            description: z.string().min(1, "description is required"),
            quantity: z.number().min(1, "Quantity is required"),
            rate: z.number().positive("Rate must be greater than 0"),
            amount: z.number().nonnegative("Amount cannot be negative"),
        })
    ).min(1, "At least one line item is required"),
    discountValue: z.number(),
    taxValue: z.number(),
    notes: z.string(),
    termsAndConditions: z.string(),
    payment: z.object({
        mode: z.enum(["cash", "bank_transfer", "credit_card", "debit_card", "upi", "cheque", "paypal", "other"]).nullable(),
        receivedDate: z.coerce.date().nullable(),
        amount: z.number().nullable(),
        note: z.string()
    }),
    showLogo: z.boolean()
}).superRefine((data, ctx) => {
    if (data.status === "paid" &&
        (!data.payment.mode || !data.payment.receivedDate || !data.payment.amount)) {
        ctx.addIssue({
            code: "custom",
            path: ["payment"],
            message: "Payment details are required"
        })
    }
})

export const updateInvoiceSchema = createInvoiceSchema.omit({
    clientId: true,
    showLogo: true
})

export const changeInvoiceStatusSchema = z.object({
    status: z.enum(["paid", "unpaid"]),
    payment: z.object({
        mode: z.enum(["cash", "bank_transfer", "credit_card", "debit_card", "upi", "cheque", "paypal", "other"]).nullable(),
        receivedDate: z.coerce.date().nullable(),
        amount: z.number().nullable(),
        note: z.string()
    })
}).superRefine((data, ctx) => {
    if (data.status === "paid" && (!data.payment.mode || !data.payment.receivedDate || data.payment.amount === null)) {
        ctx.addIssue({
            code: "custom",
            path: ["payment"],
            message: "Payment details are required for paid invoices"
        })
    }
})

export const deleteInvoiceSchema = z.object({
    invoiceIds: z.array(z.string().refine(mongoose.Types.ObjectId.isValid, "Invalid invoice ID")).min(1, "At least 1 invoice ID is required")
})

export const updateInvoiceLogoVisibilitySchema = z.object({
    showLogo: z.boolean()
})

export const getInvoicesSchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().max(100).default(10),

    filter: z.enum(["paid", "unpaid", "overdue", "draft"]).optional(),
    sortBy: z.enum(["createdAt", "dueDate", "amount", "client"]).default("createdAt"),
    order: z.enum(["asc", "desc"]),
    search: z.string().trim().optional()
})

export const getSoftDeletedInvoicesSchema = z.object({
    page: z.coerce.number().default(1),
    limit: z.coerce.number().max(100).default(10),
})


export type CreateInvoiceData = z.infer<typeof createInvoiceSchema>
export type UpdateInvoiceData = z.infer<typeof updateInvoiceSchema>
export type ChangeInvoiceStatusData = z.infer<typeof changeInvoiceStatusSchema>
export type GetInvoicesData = z.infer<typeof getInvoicesSchema>