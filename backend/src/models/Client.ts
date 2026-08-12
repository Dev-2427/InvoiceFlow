import { Schema, model, type Types } from "mongoose";

export interface IClient {
    organization: Types.ObjectId,
    clientType: "individual" | "business",
    status: "active" | "inactive",
    salutation: "Mr." | "Mrs." | "Ms." | "Dr." | "Prof." | null,
    firstName: string | null,
    lastName: string | null,
    companyName: string | null,
    displayName: string,
    email: string | null,
    phone: string | null,
    billingAddress: {
        street1: string,
        street2: string,
        city: string,
        state: string,
        pincode: string,
        country: string,
    },
    shippingAddress: {
        street1: string,
        street2: string,
        city: string,
        state: string,
        pincode: string,
        country: string,
    }
}

const clientSchema = new Schema<IClient>({
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        index: true,
        required: true
    },
    clientType: {
        type: String,
        enum: ["individual", "business"],
        required: [true, "Client type is required"],
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    salutation: {
        type: String,
        enum: ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."],
        default: null
    },
    firstName: {
        type: String,
        trim: true,
        minLength: [2, "First name must be at leart 2 characters"],
        maxLength: [50, "First name cannot exceed 50 characters"],
        default: null
    },
    lastName: {
        type: String,
        trim: true,
        minLength: [2, "Last name must be at leart 2 characters"],
        maxLength: [50, "Last name cannot exceed 50 characters"],
        default: null
    },
    companyName: {
        type: String,
        maxLength: [100, "Company name cannot exceed 100 characters"],
        minLength: [2, "Company name must be at leart 2 characters long"],
        trim: true,
        default: null
    },
    displayName: {
        type: String,
        required: [true, "Display name is required"],
        trim: true,
        minLength: [2, "Display name must be at leart 2 characters long"],
        maxLength: [100, "Display name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
        default: null
    },
    phone: {
        type: String,
        trim: true,
        minLength: [7, "Phone number must be at least 7 digits long"],
        maxLength: [20, "Phone number cannot exceed 20 characters"],
        default: null
    },
    billingAddress: {
        street1: { type: String },
        street2: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String },
    },
    shippingAddress: {
        street1: { type: String },
        street2: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String },
    },
}, { timestamps: true })

clientSchema.index({ organization: 1, displayName: 1 }, { unique: true })

const Client = model<IClient>("Client", clientSchema)

export default Client