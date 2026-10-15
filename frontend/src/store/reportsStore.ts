import { create } from "zustand";
import type { GetReportsSchemaInput } from "../validation/reportsValidation";
import type { ApiResponse } from "../types/api.types";
import { getReportsApi } from "../api/reports.api";
import type { GetReportsData, GetReportsParams } from "../types/reports.types";
import { getTimeZone } from "../utils/getTimeZone";
import { failureResponse } from "../utils/failureResponse";

interface IReportsStore {
    isGettingReports: boolean,
    getReports: (data: GetReportsSchemaInput, page: number) => Promise<ApiResponse<{ data: GetReportsData }>>
    reports: GetReportsData | null,
    invoicesLimitForReports: number,
    lastFetchedFilterData: GetReportsSchemaInput
}

const reportsStore = create<IReportsStore>((set, get) => ({
    isGettingReports: false,
    reports: null,
    invoicesLimitForReports: 10,
    lastFetchedFilterData: {
        clientId: null,
        dateRange: "today",
        from: null,
        to: null,
        status: "all"
    },

    async getReports(data, page) {
        set({ isGettingReports: true })
        try {
            const query: GetReportsParams = {
                ...data,
                page,
                limit: get().invoicesLimitForReports,
                timeZone: getTimeZone(),
                from: data.from ?? null,
                to: data.to ?? null,
                clientId: data.clientId ?? null
            }
            const res = await getReportsApi(query)

            if (res.data.success) {
                set({ reports: res.data.data, lastFetchedFilterData: data })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to fetch reports:", error)
            return failureResponse()
        } finally {
            set({ isGettingReports: false })
        }
    }
}))

export default reportsStore