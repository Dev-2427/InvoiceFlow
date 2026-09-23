import type { DashboardParams, RevenueAndReceiptsParams } from "../types/dashboard.type";
import api from "./axios";

export function getDashboardDataApi(query: DashboardParams) {
    return api.get("/api/dashboard", {
        params: query
    })
}

export function getRevenueAndReceiptsApi(query: RevenueAndReceiptsParams) {
    return api.get("/api/dashboard/revenue_receipts", {
        params: query
    })
}