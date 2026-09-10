import { Router } from "express";
import validate from "../middleware/validate.js";
import { changeInvoiceStatusSchema, createInvoiceSchema, deleteInvoiceSchema, updateInvoiceLogoVisibilitySchema, updateInvoiceSchema } from "../validations/invoice.validation.js";
import { changeInvoiceStatus, updateInvoiceLogoVisibility, createInvoice, restoreDeletedInvoices, softDeleteInvoice, updateInvoice, getInvoiceData, getInvoices, deleteInvoicesPermanently, getSoftDeletedInvoices, sendInvoiceEmail } from "../controllers/invoice.controller.js";
import loadCurrentOrganization from "../middleware/loadCurrentOrganization.js";
import invoiceAttachment from "../middleware/invoiceAttachment.js";

const route = Router()

route.post("/create", validate(createInvoiceSchema), createInvoice)
route.post("/send/:invoiceId", loadCurrentOrganization, invoiceAttachment.single("pdf"), sendInvoiceEmail)
route.get("/", getInvoices)
route.get("/soft_deleted", getSoftDeletedInvoices)
route.get("/:invoiceId", getInvoiceData)
route.patch("/update/:invoiceId", validate(updateInvoiceSchema), updateInvoice)
route.patch("/status/:invoiceId", validate(changeInvoiceStatusSchema), changeInvoiceStatus)
route.patch("/soft_delete", validate(deleteInvoiceSchema), softDeleteInvoice)
route.patch("/restore", validate(deleteInvoiceSchema), restoreDeletedInvoices)
route.patch("/show_logo/:invoiceId", validate(updateInvoiceLogoVisibilitySchema), updateInvoiceLogoVisibility)
route.delete("/", validate(deleteInvoiceSchema), deleteInvoicesPermanently)

export default route