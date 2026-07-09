import { Schema, Types, model } from "mongoose";

interface IInvoice {
    organization: Types.ObjectId,
    client: Types.ObjectId,
    invoiceNumber: string,
    status: "draft" | "unpaid" | "paid" | "overdue",
    issueDate: Date,
    dueDate: Date,
    currency: {
        code: string,
        symbol: string
    },
    lineItems: [{
        description: string,
        quantity: number,
        rate: number,
        amount: number
    }],
    subtotal: number,
    discountValue: number,
    discountAmount: number,
    taxValue: number,
    taxAmount: number,
    totalAmount: number,
    notes: string,
    termsAndConditions: string,
    payment: {
        mode: "cash" | "bank_transfer" | "credit_card" | "debit_card" | "upi" | "cheque" | "paypal" | "other" | null,
        receivedDate: Date | null,
        amount: number | null,
        note: string
    },
    showLogo: boolean,
    email: {
        sent: boolean,
        sentAt: Date | null,
        sentTo: string | null
    },
    isDeleted: boolean,
    deletedAt: Date | null
}

const invoiceSchema = new Schema<IInvoice>({
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        index: true,
        required: true
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: "Client",
        index: true,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["draft", "unpaid", "paid", "overdue"],
        index: true,
        required: true
    },
    issueDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    currency: {
        code: {
            type: String,
            required: true
        },
        symbol: {
            type: String,
            required: true
        }
    },
    lineItems: [
        {
            description: { type: String, required: true },
            quantity: { type: Number, required: true, min: 0 },
            rate: { type: Number, required: true, min: 0 },
            amount: { type: Number, required: true },
        }
    ],
    subtotal: {
        type: Number,
        required: true
    },
    discountValue: {
        type: Number,
        default: 0
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    taxValue: {
        type: Number,
        default: 0
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        default: ""
    },
    termsAndConditions: {
        type: String,
        default: ""
    },
    payment: {
        mode: {
            type: String,
            enum: ["cash", "bank_transfer", "credit_card", "debit_card", "upi", "cheque", "paypal", "other", null],
            default: null
        },
        receivedDate: {
            type: Date,
            default: null
        },
        amount: {
            type: Number,
            default: null
        },
        note: {
            type: String,
            default: ""
        }
    },
    showLogo: {
        type: Boolean,
        default: false
    },
    email: {
        sent: {
            type: Boolean,
            default: false
        },
        sentAt: {
            type: Date,
            default: null
        },
        sentTo: {
            type: String,
            default: null,
            trim: true
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

invoiceSchema.index({ organization: 1, invoiceNumber: 1 }, { unique: true })

const Invoice = model<IInvoice>("Invoice", invoiceSchema)

export default Invoice