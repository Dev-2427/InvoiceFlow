import z from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string().trim().min(2).max(50),
    lastName: z.string().trim().min(2).max(50).optional(),
    country: z.string().trim().optional()
})