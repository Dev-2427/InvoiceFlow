import type { getClientsParams } from "../types/clientTypes";
import api from "./axios";

export function getClientsApi(query: getClientsParams) {
    return api.get("/api/client/get_clients", { params: query })
}