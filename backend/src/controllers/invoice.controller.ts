import type { Request, Response } from "express";
import sendResponse from "../utils/sendResponse.js";
import Organization from "../models/Organization.js";
import Client from "../models/Client.js";
import Invoice from "../models/Invoice.js";
import mongoose from "mongoose";
import type { ChangeInvoiceStatusData, CreateInvoiceData, UpdateInvoiceData } from "../validations/invoice.validation.js";

type InvoiceParams = {
    invoiceId: string
}

async function createInvoice(req: Request, res: Response) {
    const { clientId, status, issueDate, dueDate, lineItems, discountValue, taxValue, notes, termsAndConditions, payment }: CreateInvoiceData = req.body

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
        })

        await invoice.save({ session })

        await session.commitTransaction()

        return sendResponse(res, { status: 201, message: "Invoice created successfully", data: { invoiceId: invoice._id } })
    } catch (error) {
        await session.abortTransaction()
        console.error("Failed to create an invoice");
        return sendResponse(res, { status: 500, message: "Failed create an invoice" })
    } finally {
        await session.endSession()
    }

}

async function updateInvoice(req: Request<InvoiceParams>, res: Response) {
    const { status, issueDate, dueDate, lineItems, discountValue, taxValue, notes, termsAndConditions, payment }: UpdateInvoiceData = req.body

    const organizationId = req.organization?.organizationId
    const invoiceId = req.params.invoiceId

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return sendResponse(res, { status: 400, message: "Invalid invoice ID" })
    }

    try {

        let finalStatus: "draft" | "unpaid" | "paid" | "overdue";

        if (status === "draft") {
            finalStatus = "draft"
        } else if (payment.mode && payment.receivedDate && payment.amount !== null) {
            finalStatus = "paid"
        } else if (dueDate < new Date()) {
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

        const invoice = await Invoice.findOneAndUpdate({
            _id: invoiceId,
            organization: organizationId,
        },
            {
                status: finalStatus,
                issueDate,
                dueDate,
                lineItems: calculatedLineItems,
                discountValue,
                discountAmount,
                taxValue,
                taxAmount,
                subtotal,
                totalAmount,
                notes,
                termsAndConditions,
                payment
            }).lean()

        if (!invoice) {
            return sendResponse(res, { status: 404, message: "Invoice not found" })
        }

        return sendResponse(res, { status: 200, message: "Invoice updated successfully", data: { invoiceId: invoice._id } })

    } catch (error) {
        console.error("Failed to update invoice:", error);
        return sendResponse(res, { status: 500, message: "Failed to update invoice" })
    }


}

async function changeInvoiceStatus(req: Request<InvoiceParams>, res: Response) {

    const { status, payment }: ChangeInvoiceStatusData = req.body

    const organizationId = req.organization?.organizationId
    const invoiceId = req.params.invoiceId

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return sendResponse(res, { status: 400, message: "Invalid invoice ID" })
    }

    try {

        const invoice = await Invoice.findOne({
            _id: invoiceId,
            organization: organizationId
        })

        if (!invoice) {
            return sendResponse(res, { status: 404, message: "Invoice not found" })
        }

        if (status === "paid") {
            payment.amount = invoice.totalAmount
            invoice.status = "paid"
            invoice.payment = payment
        } else if (status === "unpaid") {
            if (invoice.dueDate < new Date()) {
                invoice.status = "overdue"
            } else {
                invoice.status = "unpaid"
            }
            invoice.payment = {
                mode: null,
                receivedDate: null,
                amount: null,
                note: ""
            }
        }

        await invoice.save()

        return sendResponse(res, { status: 200, message: "Invoice status changed successfully" })

    } catch (error) {
        console.error("Failed to change invoice status");
        return sendResponse(res, { status: 500, message: "Failed to change invoice status" })
    }

}

async function softDeleteInvoice(req: Request, res: Response) {

    const organizationId = req.organization?.organizationId
    const { invoiceIds } = req.body

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const invoices = await Invoice.updateMany({
            _id: { $in: invoiceIds },
            organization: organizationId,
            isDeleted: false
        },
            {
                isDeleted: true,
                deletedAt: new Date()
            }
        )

        if (invoices.modifiedCount === 0) {
            return sendResponse(res, { status: 404, message: "Invoice not found" })
        }

        return sendResponse(res, { status: 200, message: `${invoiceIds.length === 1 ? "Invoice" : "Invoices"} deleted successfully, can be restored within 30 days.` })
    } catch (error) {
        console.error("Failed to delete invoice");
        return sendResponse(res, { status: 500, message: "Failed to delete invoice" })
    }
}

async function restoreDeletedInvoices(req: Request, res: Response) {
    const { invoiceIds } = req.body
    const organizationId = req.organization?.organizationId

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const invoices = await Invoice.updateMany({
            _id: { $in: invoiceIds },
            organization: organizationId,
            isDeleted: true
        },
            {
                isDeleted: false,
                deletedAt: null
            })

        if (invoices.modifiedCount === 0) {
            return sendResponse(res, { status: 404, message: "Invoice not found" })
        }

        return sendResponse(res, { status: 200, message: `${invoiceIds.length === 1 ? "Invoice" : "Invoices"} restored successfully` })

    } catch (error) {
        console.error("Failed to restore invoices");
        return sendResponse(res, { status: 500, message: "Failed to restore invoices" })
    }
}

async function updateInvoiceLogoVisibility(req: Request<InvoiceParams>, res: Response) {

    const invoiceId = req.params.invoiceId
    const organizationId = req.organization?.organizationId

    const { showLogo } = req.body

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return sendResponse(res, { status: 400, message: "Invalid invoice ID" })
    }

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const invoice = await Invoice.findOneAndUpdate({
            _id: invoiceId,
            organization: organizationId
        },
            { showLogo }
        ).lean()

        if (!invoice) {
            return sendResponse(res, { status: 404, message: "Invoice not found" })
        }

        return sendResponse(res, { status: 200, message: "Logo status changed successfully" })

    } catch (error) {
        console.error("Failed to change logo status:", error);
        return sendResponse(res, { status: 500, message: "Failed to change logo status" })
    }
}

async function getInvoiceData(req: Request<InvoiceParams>, res: Response) {

    const organizationId = req.organization?.organizationId
    const invoiceId = req.params.invoiceId

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return sendResponse(res, { status: 400, message: "Invalid invoice ID" })
    }

    try {
        const invoice = await Invoice.findOne({
            _id: invoiceId,
            organization: organizationId,
        }).lean()

        if (!invoice) {
            return sendResponse(res, { status: 404, message: "Invoice not found" })
        }

        return sendResponse(res, { status: 200, message: "Data fetched successfully", data: { invoiceData: invoice } })


    } catch (error) {
        console.error("Failed to get invoice data:", error)
        return sendResponse(res, { status: 500, message: "Failed to get invoice data" })
    }

}

export { createInvoice, updateInvoice, changeInvoiceStatus, softDeleteInvoice, restoreDeletedInvoices, updateInvoiceLogoVisibility, getInvoiceData }