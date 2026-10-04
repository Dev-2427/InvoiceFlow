import type { GetReportsParams } from "../types/reports.types";
import api from "./axios";

export function getReportsApi(query: GetReportsParams) {
    return api.get("/api/reports/", {
        params: query
    })
}