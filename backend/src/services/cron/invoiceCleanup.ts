import cron from "node-cron"
import Invoice from "../../models/Invoice.js";

cron.schedule("0 */12 * * *", async () => {
    console.log("Running invoice cleanup...")

    try {

        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

        const deleteInvoices = await Invoice.deleteMany({
            isDeleted: true,
            deletedAt: { $lte: thirtyDaysAgo }
        })

        console.log(`${deleteInvoices.deletedCount} invoices deleted` )
    } catch (error) {
        console.error("Invoice delete cleanup failed:", error)
    }
})