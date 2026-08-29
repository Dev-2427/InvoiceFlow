import type { CreateInvoiceInput } from "../validation/invoice.validation";
import api from "./axios";

export function createInvoiceApi(data: CreateInvoiceInput) {
    return api.post("/api/invoice/create", data)
}