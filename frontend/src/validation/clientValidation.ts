import z from "zod"

function optionalString(schema: z.ZodString) {
    return z.preprocess(
        value => value === "" ? null : value,
        schema.nullable().optional()
    )
}

function optionalEmail() {
    return z.preprocess(
        value => value === "" ? undefined : value,
        z.email().trim().toLowerCase().nullable().optional()
    )
}

const clientType = z.enum(["business", "individual"])
const salutation = z.enum(["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]).optional();
const name = optionalString(z.string().trim().min(2, "At least 2 characters is required").max(50, "Last name cannot exceed more than 50 characters"))
const companyName = optionalString(z.string().trim().min(2, "At least 2 characters is required").max(50, "Company name cannot exceed more than 50 characters"))
const displayName = z.string().trim().min(2, "At least 2 characters is required").max(100, "Display name cannot exceed more than 100 characters")
const email = optionalEmail()
const phone = optionalString(z.string().trim().min(7, "At least 7 numbers is required").max(20, "Phone number cannot exceed more than 20 characters"))
const address = z.object({
    street1: z.string().trim(),
    street2: z.string().trim().optional(),
    city: z.string().trim(),
    pincode: z.string().trim(),
    state: z.string().trim(),
    country: z.string().trim()
}).optional()


export const createClientSchema = z.object({
    clientType,
    salutation,
    firstName: name,
    lastName: name,
    companyName,
    displayName,
    email,
    phoneCode: z.string().optional(),
    phone,
    billingAddress: address,
    shippingAddress: address
}).superRefine((data, ctx) => {
    if (data.clientType === "individual" && !data.firstName) {
        ctx.addIssue({
            code: "custom",
            path: ["firstName"],
            message: "First name is required for individual clients"
        })
    }

    if (data.clientType === "business" && !data.companyName) {
        ctx.addIssue({
            code: "custom",
            path: ["companyName"],
            message: "Company name is required for business clients"
        })
    }

    if (data.phone && !data.phoneCode) {
        ctx.addIssue({
            code: "custom",
            path: ["phoneCode"],
            message: "Please select a country code"
        })
    }
})

export type CreateClientInput = z.infer<typeof createClientSchema>