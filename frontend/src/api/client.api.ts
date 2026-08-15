import type { getClientsParams } from "../types/clientTypes";
import type { BaseClientInput, CreateClientInput } from "../validation/clientValidation";
import api from "./axios";

export function getClientsApi(query: getClientsParams) {
    return api.get("/api/client/get_clients", { params: query })
}

export function changeClientStatusApi(clientIds: string[], status: "active" | "inactive") {
    return api.patch("/api/client/status", { clientIds, status })
}

export function deleteClientsApi(clientIds: string[]) {
    return api.delete("/api/client/", { data: { clientIds } })
}

export function createClientApi(data: CreateClientInput) {
    return api.post("/api/client/", data)
}

export function getClientOverviewApi(id: string) {
    return api.get(`/api/client/${id}`)
}

export function updateClientApi(data: BaseClientInput, id: string) {
    return api.patch(`/api/client/${id}`, data)
}