import { Router } from "express";
import validate from "../middleware/validate.js";
import { createInvoiceSchema, updateInvoiceSchema } from "../validations/invoice.validation.js";
import { createInvoice, updateInvoice } from "../controllers/invoice.controller.js";

const route = Router()

route.post("/create", validate(createInvoiceSchema), createInvoice)
route.patch("/update/:invoiceId", validate(updateInvoiceSchema), updateInvoice)

export default route