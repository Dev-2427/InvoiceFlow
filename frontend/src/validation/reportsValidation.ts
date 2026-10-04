import z, { coerce } from "zod";

export const getReportsSchema = z.object({
    dateRange: z.enum(["today", "this_month", "this_week", "this_year", "custom"]),
    from: coerce.date().nullable(),
    to: coerce.date().nullable(),
    clientId: z.string().nullable(),
    status: z.enum(["paid", "unpaid", "overdue", "draft", "all"]),
}).superRefine((data, ctx) => {
    if (data.dateRange === "custom" && (data.from === null || data.to === null)) {
        ctx.addIssue({
            code: "custom",
            path: ["dateRange"],
            message: "Custom dates are required"
        })
    }

    if (
        data.dateRange === "custom" &&
        data.from !== null &&
        data.to !== null &&
        data.from > data.to
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["dateRange"],
            message: "End date must be after start date"
        })
    }
})

export type GetReportsSchemaInput = z.infer<typeof getReportsSchema>