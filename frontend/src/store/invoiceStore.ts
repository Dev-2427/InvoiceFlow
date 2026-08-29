import { create } from "zustand";
import type { ApiResponse } from "../types/api.types";
import { createInvoiceApi } from "../api/invoice.api";
import type { CreateInvoiceInput } from "../validation/invoice.validation";

interface IInvoiceStore {
    creatingInvoice: boolean,
    createInvoice: (data: CreateInvoiceInput) => Promise<ApiResponse<{ invoiceId: string }>>
}

const invoiceStore = create<IInvoiceStore>((set) => ({
    creatingInvoice: false,

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
}))

export default invoiceStore