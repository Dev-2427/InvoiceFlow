import { create } from "zustand";
import type { IClientFilter, GetClientsResponseData, IClientSort, getClientsParams } from "../types/clientTypes";
import type { ApiResponse } from "../types/api.types";
import { getClientsApi } from "../api/client";

interface IClientStore {
    clientSort: IClientSort,
    clientFilter: IClientFilter,
    clientSearch: string,
    isGettingClients: boolean,
    clients: GetClientsResponseData | null,

    selectedClientIds: string[],
    changeSelectedClientsIds: (id: string) => void,
    emptySelectedClientsIds: () => void,

    setClientSortAndOrder: (sort: IClientSort) => void,
    setClientFilter: (filter: IClientFilter) => void,
    setClientSearch: (text: string) => void

    nextClientPage: number,
    clientPageLimit: number,

    getClients: (page: number) => Promise<ApiResponse<{ data: GetClientsResponseData }>>
}

const clientStore = create<IClientStore>((set, get) => ({
    clientSort: {
        label: "Created (Newest)",
        order: "desc",
        sort: "createdAt"
    },
    clientFilter: { label: "All", filter: "all" },
    clientSearch: "",
    isGettingClients: false,
    nextClientPage: 1,
    clientPageLimit: 10,
    clients: null,

    selectedClientIds: [],

    changeSelectedClientsIds(id) {

        set((state) => {
            const alreadySelectedId = get().selectedClientIds.includes(id)

            return {
                selectedClientIds: alreadySelectedId ? state.selectedClientIds.filter((selectedId) => selectedId !== id)
                    :
                    [...state.selectedClientIds, id]
            }
        })
    },

    emptySelectedClientsIds() {
        set({ selectedClientIds: [] })
    },

    setClientSortAndOrder(sort) {
        set({ clientSort: sort })
    },

    setClientFilter(filter) {
        set({ clientFilter: filter })
    },

    setClientSearch(text) {
        set({ clientSearch: text })
    },

    async getClients(page) {

        set({ isGettingClients: true })

        try {
            const clientSort = get().clientSort
            const clientFilter = get().clientFilter
            const clientSearch = get().clientSearch
            const clientPageLimit = get().clientPageLimit

            const params: getClientsParams = {
                sortBy: clientSort.sort,
                order: clientSort.order,
                page,
                limit: clientPageLimit
            }

            if (clientSearch.trim()) {
                params.search = clientSearch
            }

            if (clientFilter.filter !== "all") {
                params.filter = clientFilter.filter
            }

            const res = await getClientsApi(params)

            if (res.data.success) {
                set({ clients: res.data.data })
            }

            return res.data

        } catch (error) {
            console.error("Failed to fetch clients data:", error);
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isGettingClients: false })
        }
    },
}))

export default clientStore