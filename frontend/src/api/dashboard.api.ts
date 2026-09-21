import type { DashboardParams } from "../types/dashboard.type";
import api from "./axios";

export function getDashboardDataApi(query: DashboardParams) {
    return api.get("/api/dashboard", {
        params: query
    })
}