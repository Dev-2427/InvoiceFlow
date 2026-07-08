import connectDB, { disconnect } from "./config/database.js"
import { env } from "./config/env.js"
import app from './app.js'

async function startServer() {
    await connectDB()

    app.listen(env.PORT, () => {
        console.log(`Server is running on port ${env.PORT}`)
    })
}

startServer().catch((error) => {
    console.error("Failed to start server:", error)
    process.exit(1)
})

async function shutdown() {
    try {
        await disconnect()
        process.exit(0)
    } catch (error) {
        console.error("Shutdown failed:", error)
        process.exit(1)
    }
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)