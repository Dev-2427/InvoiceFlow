import { create } from "zustand";
import type { ApiResponse } from "../types/api.types";
import { getDashboardDataApi } from "../api/dashboard.api";
import type { DashboardResponseData, revenueAndReceiptsFilter } from "../types/dashboard.type";
import { getTimeZone } from "../utils/getTimeZone";

interface IDashboardStore {
    recentInvoiceLimit: number,
    revenueAndReceiptsFilter: revenueAndReceiptsFilter,
    isGettingDashboardData: boolean,
    dashboardData: DashboardResponseData | null,
    getDashboardData: () => Promise<ApiResponse<null>>
}

const dashboardStore = create<IDashboardStore>((set, get) => ({
    recentInvoiceLimit: 5,
    revenueAndReceiptsFilter: "current_year",
    isGettingDashboardData: false,
    dashboardData: null,

    async getDashboardData() {
        set({ isGettingDashboardData: true })
        try {
            const query = {
                recentInvoiceLimit: get().recentInvoiceLimit,
                revenueFilter: get().revenueAndReceiptsFilter,
                timeZone: getTimeZone()
            }

            const res = await getDashboardDataApi(query)

            if (res.data.success) {
                set({ dashboardData: res.data.data })
            }
            return res.data
        } catch (error: any) {
            console.error("Failed to fetch dashboard data:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isGettingDashboardData: false })
        }
    },
}))

export default dashboardStore