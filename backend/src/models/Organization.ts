import { Schema, Types, model } from "mongoose";

interface IOrganization {
    owner: Types.ObjectId,
    organizationName: string,
    logo: {
        url: string | null,
        fileId: string | null
    },
    email: string,
    phone: string | null,
    gstNumber: string | null,
    currency: {
        code: string,
        symbol: string
    },
    address: {
        street1: string,
        street2: string | null,
        city: string,
        state: string,
        pincode: string,
        country: string
    },
    invoiceCounter: number,
    termsAndConditions: string,
    createdAt: Date,
    updatedAt: Date
}

const organizationSchema = new Schema<IOrganization>({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    organizationName: {
        type: String,
        required: [true, "Organization name is required"],
        minLength: [2, "Organization name must be at leart 2 characters"],
        maxLength: [100, "Organization name cannot exceed 100 characters"],
        trim: true
    },
    logo: {
        url: {
            type: String,
            default: null
        },
        fileId: {
            type: String,
            default: null
        }
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    phone: {
        type: String,
        default: null,
    },
    gstNumber: {
        type: String,
        trim: true,
        uppercase: true,
        default: null
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
    address: {
        street1: { type: String, required: true },
        street2: { type: String, default: null },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, required: true },
    },
    invoiceCounter: {
        type: Number,
        default: 0
    },
    termsAndConditions: {
        type: String,
        default: ""
    },
}, { timestamps: true })

organizationSchema.index({ owner: 1, organizationName: 1 }, { unique: true })

const Organization = model<IOrganization>("Organization", organizationSchema)

export default Organization