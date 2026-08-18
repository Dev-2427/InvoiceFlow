import { Router } from "express";
import validate from "../middleware/validate.js";
import { createInvoiceSchema } from "../validations/invoice.validation.js";
import { createInvoice } from "../controllers/invoice.controller.js";

const route = Router()

route.post("/create", validate(createInvoiceSchema), createInvoice)

export default route