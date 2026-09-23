import z, { coerce } from "zod";

export const getDashboardDataSchema = z.object({
    revenueFilter: z.enum(["current_year", "previous_year", "past_12_months"]),
    timeZone: z.string(),
    recentInvoicesLimit: coerce.number().default(5)
})

export const getRevenueAndReceiptsDataSchema = getDashboardDataSchema.omit({
    recentInvoicesLimit: true
})