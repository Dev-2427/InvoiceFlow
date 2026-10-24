import cron from "node-cron"
import User from "../../models/User.js"

cron.schedule("0 */12 * * *", async () => {

    console.log("Running user cleanup...")

    try {
        const aDayBefore = new Date(Date.now() - 24 * 60 * 60 * 1000)

        const deletedUsers = await User.deleteMany({
            isVerified: false,
            createdAt: { $lt: aDayBefore }
        })

        console.log(`${deletedUsers.deletedCount} users deleted`)

    } catch (error) {
        console.error("Failed to delete unverified users:", error)
    }
})