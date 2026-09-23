import { create } from "zustand";
import type { ApiResponse } from "../types/api.types";
import { getDashboardDataApi } from "../api/dashboard.api";
import type { DashboardResponseData, RevenueAndReceiptsCHartFilter } from "../types/dashboard.type";
import { getTimeZone } from "../utils/getTimeZone";

interface IDashboardStore {
    recentInvoiceLimit: number,
    isGettingDashboardData: boolean,
    dashboardData: DashboardResponseData | null,
    getDashboardData: () => Promise<ApiResponse<null>>,
    revenueChartAndReceiptsFilter: RevenueAndReceiptsCHartFilter,
    setRevenueAndReceiptsChartFilter: (filter: RevenueAndReceiptsCHartFilter) => void
}

const dashboardStore = create<IDashboardStore>((set, get) => ({
    recentInvoiceLimit: 5,
    isGettingDashboardData: false,
    dashboardData: null,
    revenueChartAndReceiptsFilter: {
        filter: "current_year",
        label: "current year"
    },
    setRevenueAndReceiptsChartFilter(filter) {
        set({ revenueChartAndReceiptsFilter: filter })
    },

    async getDashboardData() {
        set({ isGettingDashboardData: true })
        try {
            const query = {
                recentInvoiceLimit: get().recentInvoiceLimit,
                revenueFilter: get().revenueChartAndReceiptsFilter.filter,
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