import { Router } from "express";
import validate from "../middleware/validate.js";
import { changeInvoiceStatusSchema, createInvoiceSchema, deleteInvoiceSchema, updateInvoiceSchema } from "../validations/invoice.validation.js";
import { changeInvoiceStatus, createInvoice, softDeleteInvoice, updateInvoice } from "../controllers/invoice.controller.js";
import { changeClientStatus } from "../controllers/client.controller.js";

const route = Router()

route.post("/create", validate(createInvoiceSchema), createInvoice)
route.patch("/update/:invoiceId", validate(updateInvoiceSchema), updateInvoice)
route.patch("/status/:invoiceId", validate(changeInvoiceStatusSchema), changeClientStatus)
route.patch("/soft_delete", validate(deleteInvoiceSchema), softDeleteInvoice)
export default route