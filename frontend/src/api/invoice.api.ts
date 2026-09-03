import type { getInvoiceParams, getSoftDeletedInvoiceParams } from "../types/invoice";
import type { CreateInvoiceInput } from "../validation/invoice.validation";
import api from "./axios";

export function createInvoiceApi(data: CreateInvoiceInput) {
    return api.post("/api/invoice/create", data)
}

export function getInvoicesApi(query: getInvoiceParams) {
    return api.get("/api/invoice/", { params: query })
}

export function deleteInvoicesApi(invoiceIds: string[]) {
    return api.patch("/api/invoice/soft_delete", { invoiceIds })
}

export function getSoftDeletedInvoicesApi(query: getSoftDeletedInvoiceParams) {
    return api.get("/api/invoice/soft_deleted", { params: query })
}

export function restoreDeletedInvoicesApi(invoiceIds: string[]) {
    return api.patch("/api/invoice/restore", { invoiceIds })
}

export function deleteInvoicesPermanentlyApi(invoiceIds: string[]) {
    return api.delete("/api/invoice/", { data: { invoiceIds } })
}