import { create } from "zustand";
import type { ApiResponse } from "../types/api.types";
import { changeInvoiceStatusApi, createInvoiceApi, deleteInvoicesApi, deleteInvoicesPermanentlyApi, getInvoiceOverviewApi, getInvoicesApi, getSoftDeletedInvoicesApi, restoreDeletedInvoicesApi } from "../api/invoice.api";
import type { ChangeInvoiceStatusInput, CreateInvoiceInput } from "../validation/invoice.validation";
import type { GetInvoiceOverviewData, getInvoiceParams, GetInvoicesResponseData, getSoftDeletedInvoicesResponseData, IInvoiceSort, InvoiceFilterType } from "../types/invoice.types";

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

    isGettingSoftDeletedInvoices: boolean,
    getSoftDeletedInvoices: (page: number) => Promise<ApiResponse<{ data: getSoftDeletedInvoicesResponseData }>>,
    softDeletedInvoices: getSoftDeletedInvoicesResponseData | null,
    deletedInvoicesLimit: number,

    emptySelectedInvoiceIdsForDeletion: () => void,
    allInvoiceIdSelectedForDeletion: boolean,
    selectedInvoiceIdsForDeletion: string[],
    isPerformingActionForDeletionPage: boolean,
    changeSelectedInvoiceIdsForDeletion: (id: string) => void,
    handleAllSelectedInvoicesForDeletion: () => void,
    restoreInvoices: (id: string | null) => Promise<ApiResponse<{ data: null }>>,
    deleteInvoicesPermanently: (id: string | null) => Promise<ApiResponse<{ data: null }>>,

    invoiceOverviewData: GetInvoiceOverviewData | null,
    isGettingInvoiceOverviewData: boolean,
    getInvoiceOverviewData: (id: string) => Promise<ApiResponse<{ invoiceData: GetInvoiceOverviewData }>>,
    clearInvoiceOverviewData: () => void,
    deleteOverviewInvoice: () => Promise<ApiResponse<null>>
    isChangingInvoiceStatus: boolean,
    changeInvoiceStatus: (data: ChangeInvoiceStatusInput) => Promise<ApiResponse<null>>
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

    isGettingSoftDeletedInvoices: false,
    softDeletedInvoices: null,
    deletedInvoicesLimit: 10,

    allInvoiceIdSelectedForDeletion: false,
    selectedInvoiceIdsForDeletion: [],
    isPerformingActionForDeletionPage: false,

    isGettingInvoiceOverviewData: false,
    invoiceOverviewData: null,

    isChangingInvoiceStatus: false,

    changeSelectedInvoiceIdsForDeletion(id) {

        set((state) => {
            const alreadySelectedId = get().selectedInvoiceIdsForDeletion.includes(id)

            return {
                selectedInvoiceIdsForDeletion: alreadySelectedId ? state.selectedInvoiceIdsForDeletion.filter((selectedId) => selectedId !== id)
                    :
                    [...state.selectedInvoiceIdsForDeletion, id]
            }
        })

        if (get().selectedInvoiceIdsForDeletion.length === get().softDeletedInvoices?.invoices.length) {
            set({ allInvoiceIdSelectedForDeletion: true })
        } else {
            set({ allInvoiceIdSelectedForDeletion: false })
        }
    },

    emptySelectedInvoiceIdsForDeletion() {
        set({ selectedInvoiceIdsForDeletion: [], allInvoiceIdSelectedForDeletion: false })
    },

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

    handleAllSelectedInvoicesForDeletion() {
        const selectedAll = get().allInvoiceIdSelectedForDeletion

        if (selectedAll) {
            get().emptySelectedInvoiceIdsForDeletion()
        } else {
            const invoiceIds = get().softDeletedInvoices?.invoices.map((invoice) => invoice._id)

            set({ selectedInvoiceIdsForDeletion: invoiceIds, allInvoiceIdSelectedForDeletion: true })
        }
    },

    handleSelectAllInvoices() {
        const selectedAll = get().allInvoiceIdSelected

        if (selectedAll) {
            get().emptySelectedInvoiceIds()
        } else {
            const invoiceIds = get().invoices?.invoices.map((invoice) => invoice._id)

            set({ selectedInvoiceIds: invoiceIds, allInvoiceIdSelected: true })
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

    async getSoftDeletedInvoices(page) {
        set({ isGettingSoftDeletedInvoices: true })
        try {

            const limit = get().deletedInvoicesLimit

            const params = {
                limit,
                page
            }

            const res = await getSoftDeletedInvoicesApi(params)

            if (res.data.success) {
                set({ softDeletedInvoices: res.data.data })
            }

            return res.data

        } catch (error: any) {
            console.error("Failed to get soft deleted invoices:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isGettingSoftDeletedInvoices: false })
        }
    },

    async restoreInvoices(id) {
        set({ isPerformingActionForDeletionPage: true })
        try {

            const selectedIds = id ? [id] : get().selectedInvoiceIdsForDeletion

            const res = await restoreDeletedInvoicesApi(selectedIds)

            if (res.data.success) {
                get().emptySelectedInvoiceIdsForDeletion()
                await get().getSoftDeletedInvoices(1)
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to restore invoice:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isPerformingActionForDeletionPage: false })
        }
    },

    async deleteInvoicesPermanently(id) {
        set({ isPerformingActionForDeletionPage: true })
        try {

            const selectedIds = id ? [id] : get().selectedInvoiceIdsForDeletion

            const res = await deleteInvoicesPermanentlyApi(selectedIds)

            if (res.data.success) {
                get().emptySelectedInvoiceIdsForDeletion()
                await get().getSoftDeletedInvoices(1)
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to delete permanently invoice:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isPerformingActionForDeletionPage: false })
        }
    },

    async getInvoiceOverviewData(id) {
        set({ isGettingInvoiceOverviewData: true, invoiceOverviewData: null })

        try {
            const res = await getInvoiceOverviewApi(id)

            if (res.data.success) {
                set({ invoiceOverviewData: res.data.data.invoiceData })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to get invoice overview data:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isGettingInvoiceOverviewData: false })
        }
    },

    clearInvoiceOverviewData() {
        set({ invoiceOverviewData: null })
    },

    async deleteOverviewInvoice() {
        set({ isPerformingAction: true })
        try {
            const invoiceId = get().invoiceOverviewData?._id

            if (!invoiceId) {
                return {
                    success: false,
                    message: "Invoice not found"
                }
            }

            const res = await deleteInvoicesApi([invoiceId])

            if (res.data.success) {
                set({ invoiceOverviewData: null })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to delete overview invoice:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isPerformingAction: false })
        }
    },

    async changeInvoiceStatus(data) {
        set({ isChangingInvoiceStatus: true })
        try {
            const invoiceId = get().invoiceOverviewData?._id

            if (!invoiceId) {
                return {
                    success: false,
                    message: "No invoice found"
                }
            }
            const res = await changeInvoiceStatusApi(data, invoiceId)

            if (res.data.success) {
                set((state) => {
                    if (!state.invoiceOverviewData) return state

                    let status: "paid" | "unpaid" | "overdue" = data.status

                    const due = new Date(state.invoiceOverviewData.dueDate).setHours(0, 0, 0, 0)
                    const today = new Date().setHours(0, 0, 0, 0)

                    if (data.status === "unpaid") {
                        if (due <= today) {
                            status = "overdue"
                        } else {
                            status = "unpaid"
                        }
                    }

                    return {
                        invoiceOverviewData: {
                            ...state.invoiceOverviewData, status, payment: { ...data.payment, receivedDate: data.payment.receivedDate?.toISOString() ?? null}
                        }
                    }
                })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to change invoice status:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isChangingInvoiceStatus: false })
        }
    },
}))

export default invoiceStore