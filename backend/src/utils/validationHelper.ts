import { z } from "zod";

export function optionalString(schema: z.ZodString) {
    return z.preprocess(
        value => value === "" ? undefined : value,
        schema.optional()
    )
}

export function optionalEmail() {
    return z.preprocess(
        value => value === "" ? undefined : value,
        z.email().trim().toLowerCase().optional()
    )
}