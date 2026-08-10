import { create } from "zustand";
import type { IClientFilter, GetClientsResponseData, IClientSort, getClientsParams } from "../types/clientTypes";
import type { ApiResponse } from "../types/api.types";
import { changeClientStatusApi, getClientsApi } from "../api/client";

interface IClientStore {
    clientSort: IClientSort,
    clientFilter: IClientFilter,
    clientSearch: string,
    isGettingClients: boolean,
    clients: GetClientsResponseData | null,

    selectedClientIds: string[],
    changeSelectedClientsIds: (id: string) => void,
    emptySelectedClientsIds: () => void,
    allClientIdSelected: boolean,
    handleSelectAllClients: () => void,

    setClientSortAndOrder: (sort: IClientSort) => void,
    setClientFilter: (filter: IClientFilter) => void,
    setClientSearch: (text: string) => void

    nextClientPage: number,
    clientPageLimit: number,

    isPerformingAction: boolean,
    changeClientStatus: (status: "active" | "inactive") => Promise<ApiResponse<null>>,

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

    isPerformingAction: false,
    allClientIdSelected: false,
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

        if (get().selectedClientIds.length === get().clients.clients.length) {
            set({ allClientIdSelected: true })
        } else {
            set({ allClientIdSelected: false })
        }
    },

    emptySelectedClientsIds() {
        set({ selectedClientIds: [], allClientIdSelected: false })
    },

    handleSelectAllClients() {
        const selectedAll = get().allClientIdSelected

        if (selectedAll) {
            get().emptySelectedClientsIds()
        } else {
            const clientIds = []
            get().clients.clients.map((client) => clientIds.push(client._id))

            set({ selectedClientIds: clientIds, allClientIdSelected: true })
        }
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

    async changeClientStatus(status) {
        set({ isPerformingAction: true })


        try {
            const clientIds = get().selectedClientIds

            const res = await changeClientStatusApi(clientIds, status)

            if (res.data.success) {
                get().emptySelectedClientsIds()
                await get().getClients(1)
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to update client status:", error);
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isPerformingAction: false })
        }
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