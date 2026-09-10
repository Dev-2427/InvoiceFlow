import cron from "node-cron"
import Invoice from "../../models/Invoice.js"

cron.schedule("0 */12 * * *", async () => {
    console.log("Running cron invoice overdue status...")

    try {

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const invoices = await Invoice.updateMany({
            status: "unpaid",
            dueDate: { $lte: today }
        }, {
            status: "overdue"
        })

        console.log(`${invoices.modifiedCount} invoices updated to overdue`)

    } catch (error) {
        console.error("Failed to change invoice overdue status:", error)
    }

})