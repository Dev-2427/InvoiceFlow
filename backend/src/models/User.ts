import { Schema, Types, model } from "mongoose";

interface IUser {
    firstName: string,
    lastName: string,
    email: string,
    password: string | null,
    avatar: {
        url: string | null,
        fileId: string | null
    },
    country: string | null,
    authProviders: {
        credentials: boolean,
        google: boolean
    },
    googleId: string | null,
    currentOrg: Types.ObjectId | null,
    isVerified: boolean,
    verificationCode: string | null,
    verificationCodeExpiresAt: Date | null
}

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        trim: true,
        minLength: [2, "First name must be at leart 2 characters"],
        maxLength: [50, "First name cannot exceed 50 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        trim: true,
        minLength: [2, "Last name must be at leart 2 characters"],
        maxLength: [50, "Last name cannot exceed 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        maxLength: [254, "Email cannot exceed 254 characters"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        default: null,
        minLength: [8, "Password must be at least 8 characters"]
    },
    avatar: {
        url: {
            type: String,
            default: null
        },
        fileId: {
            type: String,
            default: null
        }
    },
    country: {
        type: String,
        default: null
    },
    authProviders: {
        credentials: {
            type: Boolean,
            default: false
        },
        google: {
            type: Boolean,
            default: false
        }
    },
    googleId: {
        type: String,
        default: null
    },
    currentOrg: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        match: [/^\d{6}$/, "Verification code must contain exactly 6 digits"],
        default: null
    },
    verificationCodeExpiresAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const User = model<IUser>("User", userSchema)

export default User