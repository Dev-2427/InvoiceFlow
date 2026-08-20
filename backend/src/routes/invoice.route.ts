import { Router } from "express";
import validate from "../middleware/validate.js";
import { changeInvoiceStatusSchema, createInvoiceSchema, deleteInvoiceSchema, updateInvoiceLogoVisibilitySchema, updateInvoiceSchema } from "../validations/invoice.validation.js";
import { changeInvoiceStatus, updateInvoiceLogoVisibility, createInvoice, restoreDeletedInvoices, softDeleteInvoice, updateInvoice, getInvoiceData, getInvoices, deleteInvoicesPermanently } from "../controllers/invoice.controller.js";

const route = Router()

route.post("/create", validate(createInvoiceSchema), createInvoice)
route.get("/", getInvoices)
route.get("/:invoiceId", getInvoiceData)
route.patch("/update/:invoiceId", validate(updateInvoiceSchema), updateInvoice)
route.patch("/status/:invoiceId", validate(changeInvoiceStatusSchema), changeInvoiceStatus)
route.patch("/soft_delete", validate(deleteInvoiceSchema), softDeleteInvoice)
route.patch("/restore", validate(deleteInvoiceSchema), restoreDeletedInvoices)
route.patch("/show_logo/:invoiceId", validate(updateInvoiceLogoVisibilitySchema), updateInvoiceLogoVisibility)
route.delete("/", validate(deleteInvoiceSchema), deleteInvoicesPermanently)

export default route