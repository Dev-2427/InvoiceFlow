import mongoose from "mongoose";
import z, { coerce } from "zod";

export const getReportsSchema = z.object({
    dateRange: z.enum(["today", "this_month", "this_week", "this_year", "custom"]),
    from: coerce.date().nullable(),
    to: coerce.date().nullable(),
    timeZone: z.string(),

    clientId: z.string().refine(mongoose.Types.ObjectId.isValid, "Invalid client ID").nullable(),

    status: z.enum(["paid", "unpaid", "overdue", "draft", "all"]),

    page: coerce.number().min(1).default(1),
    limit: coerce.number().min(1).default(10)
}).superRefine((data, ctx) => {
    if (data.dateRange === "custom" && (data.from === null || data.to === null)) {
        ctx.addIssue({
            code: "custom",
            path: ["dateRange"],
            message: "Custom dates are required"
        })
    }
})