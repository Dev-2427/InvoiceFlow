import { z } from "zod";

const address = z.object({
    street1: z.string().trim().min(1, "Street address is required"),
    street2: z.string().trim().optional(),
    city: z.string().trim().min(1, "City is required"),
    pincode: z.string().trim().min(1, "Pincode / ZIP code is required"),
    state: z.string().trim().min(1, "State / Province is required"),
    country: z.string().trim().min(1, "Country is required")
})

export const createOrganizationSchema = z.object({
    organizationName: z.string().trim().min(2, "Organization name must be at least 2 characters").max(100, "Organization name cannot exceed 100 characters"),
    email: z.email().trim().toLowerCase(),
    phone: z.string().trim().optional(),
    phoneCode: z.string().optional(),
    gstNumber: z.string().trim().optional(),
    currencyCode: z.string().trim().min(1, "Please select a currency"),
    address: address,
    termsAndConditions: z.string().trim().max(500, "Terms & Conditions cannot exceed 500 characters").optional()
})

createOrganizationSchema.superRefine((data, ctx) => {
    if (data.phone && !data.phoneCode) {
        ctx.addIssue({
            code: "custom",
            path: ["phoneCode"],
            message: "Please select a country code"
        })
    }
})

export const updateOrganizationSchema = createOrganizationSchema.omit({
    address: true,
    currencyCode: true
})

export const organizationAddressSchema = z.object({
    address: address
})

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>
export type OrganizationAddressInput = z.infer<typeof organizationAddressSchema>