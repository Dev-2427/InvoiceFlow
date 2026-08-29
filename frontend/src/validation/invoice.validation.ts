import z from "zod"

const invoiceSchema = z.object({
    clientId: z.string({ error: "Invalid client" }).min(1, "Invalid client"),
    status: z.enum(["draft", "unpaid", "paid", "overdue"]),
    issueDate: z.coerce.date({ error: "Issue date is required" }),
    dueDate: z.coerce.date({ error: "Due date is required" }),
    lineItems: z.array(
        z.object({
            description: z.string().min(1, "Description is required"),
            quantity: z.number({ error: "Qty is required" }).min(1, "Quantity is required"),
            rate: z.number({ error: "Rate is required" }).positive("Rate must be greater than 0"),
        })
    ).min(1, "At least one line item is required"),
    discountValue: z.number().min(0, "Discount value cannot be negative").max(100, "Discount value cannot exceed 100"),
    taxValue: z.number().min(0, "Tax value cannot be negative").max(100, "Tax value cannot exceed 100"),
    notes: z.string(),
    payment: z.object({
        mode: z.enum(["cash", "bank_transfer", "credit_card", "debit_card", "upi", "cheque", "paypal", "other"]).nullable(),
        receivedDate: z.coerce.date({ error: "Payment received date is required" }).nullable(),
        amount: z.number().nullable(),
        note: z.string()
    })
})

export const createInvoiceSchema = invoiceSchema.superRefine((data, ctx) => {
    if (data.status === "paid" &&
        (!data.payment.mode || !data.payment.receivedDate || data.payment.amount === null)
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["payment"],
            message: "Payment details are required"
        })
    }
})

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>