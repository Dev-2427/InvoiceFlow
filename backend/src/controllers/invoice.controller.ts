import type { Request, Response } from "express";
import sendResponse from "../utils/sendResponse.js";
import Organization from "../models/Organization.js";
import Client from "../models/Client.js";
import Invoice from "../models/Invoice.js";
import mongoose from "mongoose";
import type { CreateInvoiceData } from "../validations/invoice.validation.js";

async function createInvoice(req: Request, res: Response) {
    const { clientId, status, issueDate, dueDate, lineItems, discountValue, taxValue, notes, termsAndConditions, payment, showLogo }: CreateInvoiceData = req.body

    const organizationId = req.organization?.organizationId

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    const session = await mongoose.startSession()

    try {
        session.startTransaction()

        const organization = await Organization.findByIdAndUpdate(organizationId,
            { $inc: { invoiceCounter: 1 } },
            { returnDocument: "after" }
        ).session(session)

        if (!organization) {
            await session.abortTransaction()
            return sendResponse(res, { status: 404, message: "Organization not found" })
        }

        const client = await Client.findOne({
            _id: clientId,
            organization: organizationId
        }).lean().session(session)

        if (!client) {
            await session.abortTransaction()
            return sendResponse(res, { status: 404, message: "Client not found" })
        }

        let finalStatus: "draft" | "unpaid" | "paid" | "overdue";

        if (status === "draft") {
            finalStatus = "draft"
        }
        else if (payment.mode && payment.receivedDate && payment.amount !== null) {
            finalStatus = "paid"
        }
        else if (dueDate < new Date()) {
            finalStatus = "overdue"
        } else {
            finalStatus = "unpaid"
        }

        const calculatedLineItems = lineItems.map((item) => ({
            ...item,
            amount: item.quantity * item.rate
        }))

        const subtotal: number = calculatedLineItems.reduce((prev, curr) => {
            return prev + curr.amount
        }, 0)

        const discountAmount = subtotal * (discountValue / 100)
        const taxAmount = (subtotal - discountAmount) * (taxValue / 100)
        const totalAmount = subtotal - discountAmount + taxAmount

        if (finalStatus === "paid") {
            payment.amount = totalAmount
        }

        const invoice = new Invoice({
            organization: organization._id,
            client: client._id,
            invoiceNumber: `INV-${String(organization.invoiceCounter).padStart(3, "0")}`,
            status: finalStatus,
            issueDate,
            dueDate,
            currency: organization.currency,
            lineItems: calculatedLineItems,
            subtotal,
            discountAmount,
            discountValue,
            taxAmount,
            taxValue,
            totalAmount,
            notes,
            termsAndConditions,
            payment,
            showLogo
        })

        await invoice.save({ session })

        await session.commitTransaction()

        return sendResponse(res, { status: 201, message: "Invoice created successfully" })
    } catch (error) {
        await session.abortTransaction()
        console.error("Failed to create an invoice");
        return sendResponse(res, { status: 500, message: "Failed create an invoice" })
    } finally {
        await session.endSession()
    }

}

export { createInvoice }