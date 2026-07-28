import { z } from "zod";
import { optionalEmail, optionalString } from "../utils/validationHelper.js";

const clientType = z.enum(["business", "individual"])
const salutation = z.enum(["Mr", "Mrs", "Ms", "Dr", "Prof"]).optional(); const name = optionalString(z.string().trim().min(2).max(50))
const companyName = optionalString(z.string().trim().min(2).max(50))
const displayName = z.string().trim().min(2).max(100)
const email = optionalEmail()
const phone = optionalString(z.string().trim().min(7).max(20))
const address = z.object({
    street1: z.string().trim().min(1),
    street2: z.string().trim().optional(),
    city: z.string().trim().min(1),
    pincode: z.string().trim().min(1),
    state: z.string().trim().min(1),
    country: z.string().trim().min(1)
})

export const createClientSchema = z.object({
    clientType,
    salutation,
    firstName: name,
    lastName: name,
    companyName,
    displayName,
    email,
    phone,
    billingAddress: address.optional(),
    shippingAddress: address.optional()
}).superRefine((data, ctx) => {
    if (data.clientType === "individual" && !data.firstName) {
        ctx.addIssue({
            code: "custom",
            path: ["firstName"],
            message: "First name is required"
        })
    }

    if (data.clientType === "business" && !data.companyName) {
        ctx.addIssue({
            code: "custom",
            path: ["companyName"],
            message: "Company name is required"
        })
    }
})