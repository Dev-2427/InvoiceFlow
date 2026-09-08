import type { getInvoiceParams, getSoftDeletedInvoiceParams } from "../types/invoice.types";
import type { ChangeInvoiceStatusInput, CreateInvoiceInput, UpdateInvoiceInput } from "../validation/invoice.validation";
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

export function getInvoiceOverviewApi(id: string) {
    return api.get(`/api/invoice/${id}`)
}

export function changeInvoiceStatusApi(data: ChangeInvoiceStatusInput, invoiceId: string) {
    return api.patch(`/api/invoice/status/${invoiceId}`, data)
}

export function changeLogoVisibilityApi(invoiceId: string, showLogo: boolean) {
    return api.patch(`/api/invoice/show_logo/${invoiceId}`, { showLogo })
}

export function updateInvoiceApi(data: UpdateInvoiceInput, invoiceId: string) {
    return api.patch(`/api/invoice/update/${invoiceId}`, data)
}