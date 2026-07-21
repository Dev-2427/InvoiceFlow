import { z } from "zod";

const address = z.object({
    street1: z.string().trim().min(1),
    street2: z.string().trim().optional(),
    city: z.string().trim().min(1),
    pincode: z.string().trim().min(1),
    state: z.string().trim().min(1),
    country: z.string().trim().min(1)
})

export const createOrganizationSchema = z.object({
    organizationName: z.string().trim().min(2, "Organization name must be at leart 2 characters").max(100, "Organization name cannot exceed 100 characters"),
    email: z.email().trim().toLowerCase(),
    phone: z.string().trim().optional(),
    gstNumber: z.string().trim().optional(),
    currencyCode: z.string().trim().min(1),
    address: address,
    termsAndConditions: z.string().trim().optional()
})

export const updateOrganizationSchema = z.object({
    organizationName: z.string().trim().min(1).optional(),
    email: z.email().trim().toLowerCase().optional(),
    phone: z.string().trim().optional(),
    gstNumber: z.string().trim().optional(),
    address: address.optional(),
    termsAndConditions: z.string().trim().optional()
})
    .refine(data => Object.keys(data).length > 0, {
        message: "No data provided to update"
    })
