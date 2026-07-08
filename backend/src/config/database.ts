import mongoose from "mongoose"
import { env } from "./env.js"

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB")
})

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from MongoDB")
})

mongoose.connection.on("reconnected", () => {
    console.log("Reconnected to MongoDB")
})

mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err)
})

mongoose.connection.on("close", () => {
    console.log("MongoDB connection closed")
})

let retryCount = 0
const maxRetries = 5

export default async function connectDB() {
    try {
        const URI = env.MONGODB_URI

        if (!URI) {
            console.error("MongoDB URI is not defined")
            process.exit(1)
        }

        const state = mongoose.connection.readyState

        if (state === 1) {
            console.log("MongoDB is already connected")
            return
        }

        if (state === 2) {
            console.log("MongoDB is connecting")
            return
        }

        mongoose.set("strictQuery", true)

        await mongoose.connect(URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            retryWrites: true,
            writeConcern: { w: "majority" }
        })

        retryCount = 0

    } catch (error) {
        retryCount++
        console.error("MongoDB connection error:", error)

        if (retryCount >= maxRetries) {
            console.error("MongoDB connection failed, shutting down...")
            process.exit(1)
        }

        setTimeout(connectDB, 5000);
    }
}

export function getDBStatus() {
    return mongoose.connection.readyState === 1
}

export async function disconnect() {
    await mongoose.connection.close()
    console.log("MongoDB Disconnected")
}