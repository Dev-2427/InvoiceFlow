import { create } from "zustand";
import type { IClientFilter, GetClientsResponseData, IClientSort, getClientsParams, ClientData } from "../types/clientTypes";
import type { ApiResponse } from "../types/api.types";
import { changeClientStatusApi, createClientApi, deleteClientsApi, getClientOverviewApi, getClientsApi, updateClientApi } from "../api/client.api";
import type { BaseClientInput, CreateClientInput } from "../validation/clientValidation";

interface IClientStore {
    clientSort: IClientSort,
    clientFilter: IClientFilter,
    clientSearch: string,

    selectedClientIds: string[],
    changeSelectedClientsIds: (id: string) => void,
    emptySelectedClientsIds: () => void,
    allClientIdSelected: boolean,
    handleSelectAllClients: () => void,

    setClientSortAndOrder: (sort: IClientSort) => void,
    setClientFilter: (filter: IClientFilter) => void,
    setClientSearch: (text: string) => void
    clientPageLimit: number,

    isPerformingAction: boolean,
    changeClientStatus: (status: "active" | "inactive") => Promise<ApiResponse<null>>,
    deleteClients: () => Promise<ApiResponse<null>>,

    isCreatingClient: boolean,
    createClient: (data: CreateClientInput) => Promise<ApiResponse<{ clientId: string }>>,

    isGettingClients: boolean,
    getClients: (page: number) => Promise<ApiResponse<{ data: GetClientsResponseData }>>
    clients: GetClientsResponseData | null,

    isGettingClientOverview: boolean,
    getClientOverview: (id: string) => Promise<ApiResponse<{ clientData: ClientData }>>
    clientOverviewData: ClientData | null,
    clearClientOverviewData: () => void,
    changeClientOverviewStatus: (status: "active" | "inactive") => Promise<ApiResponse<null>>,
    deleteOverviewClient: () => Promise<ApiResponse<null>>,

    isUpdatingClient: boolean,
    updateClient: (data: BaseClientInput) => Promise<ApiResponse<{ clientId: string }>>,
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
    clientPageLimit: 10,
    clients: null,

    isPerformingAction: false,
    allClientIdSelected: false,
    selectedClientIds: [],

    isCreatingClient: false,
    isUpdatingClient: false,

    isGettingClientOverview: true,
    clientOverviewData: null,

    changeSelectedClientsIds(id) {

        set((state) => {
            const alreadySelectedId = get().selectedClientIds.includes(id)

            return {
                selectedClientIds: alreadySelectedId ? state.selectedClientIds.filter((selectedId) => selectedId !== id)
                    :
                    [...state.selectedClientIds, id]
            }
        })

        if (get().selectedClientIds.length === get().clients?.clients.length) {
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
            const clientIds = get().clients?.clients.map((client) => client._id)

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

    async deleteClients() {
        set({ isPerformingAction: true })

        try {
            const clientIds = get().selectedClientIds

            const res = await deleteClientsApi(clientIds)

            if (res.data.success) {
                get().emptySelectedClientsIds()
                await get().getClients(1)
            }

            return res.data

        } catch (error: any) {
            console.error("Failed to delete clients:", error);
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

    async createClient(data) {
        set({ isCreatingClient: true })

        try {
            const res = await createClientApi(data)

            return res.data

        } catch (error: any) {
            console.error("Failed to create client:", error);
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isCreatingClient: false })
        }
    },

    async getClientOverview(id) {
        set({ isGettingClientOverview: true })

        try {
            const res = await getClientOverviewApi(id)

            if (res.data.success) {
                set({ clientOverviewData: res.data.data.clientData })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to get client overview:", error);
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isGettingClientOverview: false })
        }
    },

    clearClientOverviewData() {
        set({ clientOverviewData: null })
    },

    async changeClientOverviewStatus(status) {
        set({ isPerformingAction: true })

        try {
            const clientId = get().clientOverviewData?._id

            if (!clientId) {
                return {
                    success: false,
                    message: "Client not found"
                }
            }

            const res = await changeClientStatusApi([clientId], status)

            if (res.data.success) {
                set((state) => ({
                    clientOverviewData: state.clientOverviewData ?
                        { ...state.clientOverviewData, status } : null
                }))
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

    async deleteOverviewClient() {
        set({ isPerformingAction: true })

        try {
            const clientId = get().clientOverviewData?._id

            if (!clientId) {
                return {
                    success: false,
                    message: "Client not found"
                }
            }

            const res = await deleteClientsApi([clientId])

            if (res.data.success) {
                set({ clientOverviewData: null })
            }

            return res.data

        } catch (error: any) {
            console.error("Failed to delete the client:", error);
            return {
                success: false,
                message: "Something went wrong, please try again"
            }
        } finally {
            set({ isPerformingAction: false })
        }
    },

    async updateClient(data) {
        set({ isUpdatingClient: true })


        try {
            const clientId = get().clientOverviewData?._id

            if (!clientId) {
                return {
                    success: false,
                    message: "Client not found"
                }
            }

            const res = await updateClientApi(data, clientId)

            return res.data
        } catch (error: any) {
            console.error("Failed to update client:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isUpdatingClient: false })
        }
    },

}))

export default clientStore