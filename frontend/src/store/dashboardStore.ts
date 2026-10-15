import { create } from "zustand";
import type { ApiResponse } from "../types/api.types";
import { getDashboardDataApi, getRevenueAndReceiptsApi } from "../api/dashboard.api";
import type { DashboardResponseData, RevenueAndReceiptsChartFilter, RevenueAndReceiptsData } from "../types/dashboard.type";
import { getTimeZone } from "../utils/getTimeZone";
import { failureResponse } from "../utils/failureResponse";

interface IDashboardStore {
    recentInvoiceLimit: number,
    isGettingDashboardData: boolean,
    dashboardData: DashboardResponseData | null,
    getDashboardData: () => Promise<ApiResponse<null>>,
    revenueChartAndReceiptsFilter: RevenueAndReceiptsChartFilter,

    isGettingRevenueAndReceiptsData: boolean,
    revenueAndReceiptsData: RevenueAndReceiptsData[] | null,
    getRevenueAndReceiptsData: (filter: RevenueAndReceiptsChartFilter) => Promise<ApiResponse<{ revenueAndReceiptsData: RevenueAndReceiptsData[] }>>
}

const dashboardStore = create<IDashboardStore>((set, get) => ({
    recentInvoiceLimit: 5,
    isGettingDashboardData: false,
    dashboardData: null,
    revenueChartAndReceiptsFilter: {
        filter: "current_year",
        label: "current year"
    },

    isGettingRevenueAndReceiptsData: false,
    revenueAndReceiptsData: null,


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
                set({
                    dashboardData: res.data.data,
                    revenueAndReceiptsData: res.data.data.revenueAndReceiptsData
                })
            }
            return res.data
        } catch (error: any) {
            console.error("Failed to fetch dashboard data:", error)
            return failureResponse()
        } finally {
            set({ isGettingDashboardData: false })
        }
    },

    async getRevenueAndReceiptsData(filter) {

        if (get().revenueChartAndReceiptsFilter.filter === filter.filter) {
            return {
                success: true,
                message: "Filter already selected"
            }
        }

        set({ isGettingRevenueAndReceiptsData: true })

        try {

            const query = {
                revenueFilter: filter.filter,
                timeZone: getTimeZone()
            }

            const res = await getRevenueAndReceiptsApi(query)

            if (res.data.success) {
                set({
                    revenueAndReceiptsData: res.data.data.revenueAndReceiptsData,
                    revenueChartAndReceiptsFilter: filter
                })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to fetch revenue and receipts data:", error)
            return failureResponse()
        } finally {
            set({ isGettingRevenueAndReceiptsData: false })
        }
    }

}))

export default dashboardStore