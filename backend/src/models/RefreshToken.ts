import { Schema, model, type Types } from "mongoose";

interface IRefreshToken {
    user: Types.ObjectId,
    token: string,
    deviceName: string,
    browser: string,
    os: string,
    ipAddress: string,
    lastUsedAt: Date,
    expiresAt: Date,
    revokedAt: Date | null,
}

const refreshTokenSchema = new Schema<IRefreshToken>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
        required: true
    },
    token: {
        type: String,
        unique: true,
        required: true
    },
    deviceName: {
        type: String,
        required: true
    },
    browser: {
        type: String,
        required: true
    },
    os: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    },
    lastUsedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        index: true,
        required: true
    },
    revokedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true })


const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema)

export default RefreshToken