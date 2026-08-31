import { create } from "zustand";
import type { ApiResponse } from "../types/api.types";
import { createInvoiceApi, deleteInvoicesApi, getInvoicesApi } from "../api/invoice.api";
import type { CreateInvoiceInput } from "../validation/invoice.validation";
import type { getInvoiceParams, GetInvoicesResponseData, IInvoiceSort, InvoiceFilterType } from "../types/invoice";

interface IInvoiceStore {
    creatingInvoice: boolean,
    createInvoice: (data: CreateInvoiceInput) => Promise<ApiResponse<{ invoiceId: string }>>

    invoiceSort: IInvoiceSort,
    invoiceFilter: InvoiceFilterType,
    invoiceSearch: string,
    setInvoiceSortAndOrder: (sort: IInvoiceSort) => void,
    setInvoiceFilter: (filter: InvoiceFilterType) => void,
    setInvoiceSearch: (text: string) => void

    selectedInvoiceIds: string[],
    changeSelectedInvoiceIds: (id: string) => void,
    emptySelectedInvoiceIds: () => void,
    allInvoiceIdSelected: boolean,
    handleSelectAllInvoices: () => void,

    isPerformingAction: boolean,
    deleteInvoices: () => Promise<ApiResponse<null>>,

    isGettingInvoices: boolean,
    invoicePageLimit: number,
    invoices: GetInvoicesResponseData | null,
    getInvoices: (page: number) => Promise<ApiResponse<{ data: GetInvoicesResponseData }>>
}

const invoiceStore = create<IInvoiceStore>((set, get) => ({
    creatingInvoice: false,

    invoiceSort: {
        label: "Created (Newest)",
        sort: "createdAt",
        order: "desc"
    },
    invoiceFilter: "all",
    invoiceSearch: "",
    isGettingInvoices: false,
    invoicePageLimit: 10,
    invoices: null,

    selectedInvoiceIds: [],
    allInvoiceIdSelected: false,

    isPerformingAction: false,

    changeSelectedInvoiceIds(id) {

        set((state) => {
            const alreadySelectedId = get().selectedInvoiceIds.includes(id)

            return {
                selectedInvoiceIds: alreadySelectedId ? state.selectedInvoiceIds.filter((selectedId) => selectedId !== id)
                    :
                    [...state.selectedInvoiceIds, id]
            }
        })

        if (get().selectedInvoiceIds.length === get().invoices?.invoices.length) {
            set({ allInvoiceIdSelected: true })
        } else {
            set({ allInvoiceIdSelected: false })
        }
    },

    emptySelectedInvoiceIds() {
        set({ selectedInvoiceIds: [], allInvoiceIdSelected: false })
    },

    handleSelectAllInvoices() {
        const selectedAll = get().allInvoiceIdSelected

        if (selectedAll) {
            get().emptySelectedInvoiceIds()
        } else {
            const clientIds = get().invoices?.invoices.map((client) => client._id)

            set({ selectedInvoiceIds: clientIds, allInvoiceIdSelected: true })
        }
    },

    setInvoiceSortAndOrder(sort) {
        set({ invoiceSort: sort })
    },

    setInvoiceFilter(filter) {
        set({ invoiceFilter: filter })
    },

    setInvoiceSearch(text) {
        set({ invoiceSearch: text })
    },

    async createInvoice(data) {
        set({ creatingInvoice: true })

        try {
            const res = await createInvoiceApi(data)

            return res.data

        } catch (error: any) {
            console.error("Failed to create invoice:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ creatingInvoice: false })
        }
    },

    async getInvoices(page) {
        set({ isGettingInvoices: true })
        try {
            const invoiceSort = get().invoiceSort
            const invoiceFilter = get().invoiceFilter
            const invoiceSearch = get().invoiceSearch
            const invoicePageLimit = get().invoicePageLimit

            const params: getInvoiceParams = {
                sortBy: invoiceSort.sort,
                order: invoiceSort.order,
                page,
                limit: invoicePageLimit
            }

            if (invoiceSearch.trim()) {
                params.search = invoiceSearch
            }

            if (invoiceFilter !== "all") {
                params.filter = invoiceFilter
            }

            const res = await getInvoicesApi(params)

            if (res.data.success) {
                set({ invoices: res.data.data })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to get Invoices:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isGettingInvoices: false })
        }
    },

    async deleteInvoices() {
        set({ isPerformingAction: true })
        try {
            const invoiceIds = get().selectedInvoiceIds

            const res = await deleteInvoicesApi(invoiceIds)

            if (res.data.success) {
                get().emptySelectedInvoiceIds()
                await get().getInvoices(1)
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to delete invoice:", error);
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isPerformingAction: false })
        }
    },
}))

export default invoiceStore