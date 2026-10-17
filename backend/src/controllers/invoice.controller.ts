import type { Request, Response } from "express";
import sendResponse from "../utils/sendResponse.js";
import Organization from "../models/Organization.js";
import Client from "../models/Client.js";
import Invoice, { type IInvoice } from "../models/Invoice.js";
import mongoose, { type PipelineStage, type QueryFilter } from "mongoose";
import { getInvoicesSchema, getSoftDeletedInvoicesSchema, type ChangeInvoiceStatusData, type CreateInvoiceData, type UpdateInvoiceData } from "../validations/invoice.validation.js";
import sendEmail from "../services/email/sendEmail.js";
import invoiceEmailTemplate from "../services/email/templates/invoiceEmailTemplate.js";
import formatLocalDate from "../utils/formateLocalDate.js";

type InvoiceParams = {
    invoiceId: string
}

interface PopulatedClient {
    salutation: string | null,
    displayName: string,
    email: string | null
}

async function createInvoice(req: Request, res: Response) {
    const { clientId, status, issueDate, dueDate, lineItems, discountValue, taxValue, notes, payment }: CreateInvoiceData = req.body

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

        const today = new Date().setHours(0, 0, 0, 0)
        const due = new Date(dueDate).setHours(0, 0, 0, 0)

        if (status === "draft") {
            finalStatus = "draft"
        }
        else if (payment.mode && payment.receivedDate && payment.amount !== null) {
            finalStatus = "paid"
        }
        else if (due <= today) {
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
    const { clientId, status, issueDate, dueDate, lineItems, discountValue, taxValue, notes, payment, }: UpdateInvoiceData = req.body

    const organizationId = req.organization?.organizationId
    const invoiceId = req.params.invoiceId

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return sendResponse(res, { status: 400, message: "Invalid invoice ID" })
    }

    try {

        const today = new Date().setHours(0, 0, 0, 0)
        const due = new Date(dueDate).setHours(0, 0, 0, 0)

        let finalStatus: "draft" | "unpaid" | "paid" | "overdue";

        if (status === "draft") {
            finalStatus = "draft"
        } else if (payment.mode && payment.receivedDate && payment.amount !== null) {
            finalStatus = "paid"
        } else if (due <= today) {
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

        const client = await Client.findOne({
            _id: clientId,
            organization: organizationId
        }
        ).lean()

        if (!client) {
            return sendResponse(res, { status: 404, message: "Client not found" })
        }

        const invoice = await Invoice.findOneAndUpdate({
            _id: invoiceId,
            organization: organizationId,
            isDeleted: false
        },
            {
                client: clientId,
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
            organization: organizationId,
            isDeleted: false
        })

        if (!invoice) {
            return sendResponse(res, { status: 404, message: "Invoice not found" })
        }

        const today = new Date().setHours(0, 0, 0, 0)
        const due = new Date(invoice.dueDate).setHours(0, 0, 0, 0)

        if (status === "paid") {
            payment.amount = invoice.totalAmount
            invoice.status = "paid"
            invoice.payment = payment
        } else if (status === "unpaid") {
            if (due <= today) {
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

        return sendResponse(res, { status: 200, message: `${invoiceIds.length === 1 ? "Invoice" : "Invoices"} deleted successfully` })
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
            organization: organizationId,
            isDeleted: false
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
        })
            .populate("client", "displayName companyName")
            .lean()

        if (!invoice) {
            return sendResponse(res, { status: 404, message: "Invoice not found" })
        }

        return sendResponse(res, { status: 200, message: "Data fetched successfully", data: { invoiceData: invoice } })


    } catch (error) {
        console.error("Failed to get invoice data:", error)
        return sendResponse(res, { status: 500, message: "Failed to get invoice data" })
    }

}

async function getInvoices(req: Request, res: Response) {

    const organizationId = req.organization?.organizationId

    const passedQuery = getInvoicesSchema.safeParse(req.query)

    if (!passedQuery.success) {
        return sendResponse(res, { status: 400, message: "Invalid Queries" })
    }

    const { limit, page, filter, sortBy, order, search } = passedQuery.data

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const skip = (page - 1) * limit

        const query: QueryFilter<IInvoice> = {
            organization: new mongoose.Types.ObjectId(organizationId),
            isDeleted: false
        }
        const sort: Record<string, 1 | -1> = {}

        const sortOrder = order === "asc" ? 1 : -1

        if (filter) {
            query.status = filter
        }

        if (sortBy === "client") {
            sort["client.displayName"] = sortOrder
        } else if (sortBy === "amount") {
            sort.totalAmount = sortOrder
        } else {
            sort[sortBy] = sortOrder
        }


        const pipeline: PipelineStage[] = [
            { $match: query },
            {
                $lookup: {
                    as: "client",
                    from: "clients",
                    foreignField: "_id",
                    localField: "client"
                }
            },
            { $unwind: "$client" }
        ]

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { invoiceNumber: { $regex: search, $options: "i" } },
                        { "client.displayName": { $regex: search, $options: "i" } }
                    ]
                }
            })
        }

        pipeline.push(
            {
                $facet: {
                    invoices: [
                        { $sort: sort },
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                invoiceNumber: 1,
                                issueDate: 1,
                                dueDate: 1,
                                totalAmount: 1,
                                status: 1,
                                currency: 1,
                                client: {
                                    displayName: "$client.displayName",
                                    companyName: "$client.companyName",
                                }
                            }
                        }
                    ],
                    count: [
                        { $count: "totalItems" }
                    ]
                }
            }
        )

        const [result, deletedCount] = await Promise.all([
            Invoice.aggregate(pipeline),
            Invoice.countDocuments({
                organization: organizationId,
                isDeleted: true
            })
        ])

        const invoices = result[0].invoices
        const totalItems = result[0].count[0]?.totalItems ?? 0

        return sendResponse(res, {
            status: 200, message: "Invoices fetched successfully",
            data: {
                invoices,
                pagination: {
                    page,
                    limit,
                    totalItems,
                    totalPages: Math.ceil(totalItems / limit)
                },
                deletedCount
            }
        })

    } catch (error) {
        console.error("Failed to fetch invoices:", error)
        return sendResponse(res, { status: 500, message: "Failed to fetch invoices" })
    }
}

async function getSoftDeletedInvoices(req: Request, res: Response) {

    const organizationId = req.organization?.organizationId

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    const passedQuery = getSoftDeletedInvoicesSchema.safeParse(req.query)

    if (!passedQuery.success) {
        return sendResponse(res, { status: 400, message: "Invalid query" })
    }

    const { page, limit } = passedQuery.data

    try {
        const skip = (page - 1) * limit

        const [invoices, totalItems] = await Promise.all([
            Invoice.find(
                {
                    organization: organizationId,
                    isDeleted: true
                }
            )
                .select("invoiceNumber totalAmount deletedAt status issueDate dueDate currency")
                .populate("client", "displayName companyName -_id")
                .sort({ deletedAt: -1 })
                .skip(skip)
                .limit(limit)
            ,

            Invoice.countDocuments({
                organization: organizationId,
                isDeleted: true
            })
        ])

        return sendResponse(res, { status: 200, message: "Deleted Invoices fetched successfully", data: { invoices, pagination: { page, limit, totalPages: Math.ceil(totalItems / limit), totalItems } } })

    } catch (error) {
        console.error("Failed to fetch deleted invoices:", error);
        return sendResponse(res, { status: 500, message: "Failed to fetch deleted invoices" })
    }
}

async function deleteInvoicesPermanently(req: Request, res: Response) {

    const { invoiceIds } = req.body
    const organizationId = req.organization?.organizationId

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    try {
        const deleteResult = await Invoice.deleteMany({
            _id: { $in: invoiceIds },
            organization: organizationId,
            isDeleted: true
        })

        if (deleteResult.deletedCount === 0) {
            return sendResponse(res, { status: 404, message: "Invoice not found" })
        }

        return sendResponse(res, { status: 200, message: `${invoiceIds.length === 1 ? "Invoice" : "Invoices"} deleted successfully` })

    } catch (error) {
        console.error("Failed to delete Invoices:", error);
        return sendResponse(res, { status: 500, message: "Failed to delete Invoices" })
    }

}

async function sendInvoiceEmail(req: Request<InvoiceParams>, res: Response) {

    const invoiceId = req.params.invoiceId
    const organizationId = req.organization?.organizationId
    const pdf = req.file

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        return sendResponse(res, { status: 400, message: "Invalid invoice ID" })
    }

    if (!organizationId) {
        return sendResponse(res, { status: 401, message: "Unauthorized access" })
    }

    if (!pdf) {
        return sendResponse(res, { status: 400, message: "Invoice PDF is required" })
    }

    try {
        const invoice = await Invoice.findOne({
            _id: invoiceId,
            organization: organizationId,
            isDeleted: false
        }).populate<{ client: PopulatedClient }>("client", "salutation displayName email -_id")

        if (!invoice) {
            return sendResponse(res, { status: 404, message: "Invoice not found" })
        }

        if (!invoice.client.email) {
            return sendResponse(res, {
                status: 404, message: "Client does not have an email address. Please update the client before sending the invoice."
            })
        }

        const { html, text } = invoiceEmailTemplate({
            clientName: `${invoice.client.salutation ?? ""} ${invoice.client.displayName}`.trim(),
            invoiceNumber: invoice.invoiceNumber,
            currencySymbol: invoice.currency.symbol,
            dueDate: formatLocalDate(invoice.dueDate),
            issueDate: formatLocalDate(invoice.issueDate),
            status: invoice.status,
            totalAmount: invoice.totalAmount.toFixed(2)
        })

        await sendEmail({
            html,
            to: invoice.client.email,
            subject: `Invoice ${invoice.invoiceNumber} from InvoiceFlow`,
            text,
            attachments: [{
                filename: `${invoice.invoiceNumber}.pdf`,
                content: pdf.buffer,
                contentType: "application/pdf"
            }]
        })

        invoice.email = {
            sent: true,
            sentAt: new Date(),
            sentTo: invoice.client.email
        }
        await invoice.save()

        return sendResponse(res, { status: 200, message: "Invoice email sent successfully" })

    } catch (error) {
        console.error("Failed to send invoice email:", error)
        return sendResponse(res, { status: 500, message: "Failed to send invoice email" })
    }
}

export { createInvoice, updateInvoice, changeInvoiceStatus, softDeleteInvoice, restoreDeletedInvoices, updateInvoiceLogoVisibility, getInvoiceData, getInvoices, deleteInvoicesPermanently, getSoftDeletedInvoices, sendInvoiceEmail }