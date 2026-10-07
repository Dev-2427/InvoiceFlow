import z from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string().trim().min(2, { error: "First name must be at least 2 characters" }).max(50),
    lastName: z.preprocess(value => value === "" ? undefined : value, z.string().trim().max(50).optional()),
    country: z.preprocess(value => value === "" ? undefined : value, z.string().trim().optional())
})

export type UpdateProfileSchemaInput = z.infer<typeof updateProfileSchema>