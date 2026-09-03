import invoiceStore from "../../store/invoiceStore"
import Header from "../../components/ui/Header"
import { TbAlertTriangle, TbArrowLeft, TbTrash } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import SelectedInvoiceIdsActions from "../../components/invoice/restore/SelectedInvoiceIdsActions"
import SoftDeletedInvoicesList from "../../components/invoice/restore/SoftDeletedInvoicesList"

export default function RestoreInvoices() {

    const navigate = useNavigate()

    const softDeletedInvoices = invoiceStore((state) => state.softDeletedInvoices)
    const selectedInvoiceIdsForDeletion = invoiceStore((state) => state.selectedInvoiceIdsForDeletion)

    return (
        <main className="space-y-5 mb-5">

            <Header header="Trash" />

            {/* page header */}
            <div className="flex justify-between items-center px-5 lg:pt-4 mb-3">

                <div className="flex items-center gap-3">

                    <div className="flex items-center text-[22px] font-bold gap-1">
                        <TbTrash />
                        <span>Trash</span>
                    </div>

                    <p className="text-[13px] text-text-sm">({softDeletedInvoices?.pagination.totalItems ?? 0} deleted invoices)</p>

                </div>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex justify-center items-center gap-1 bg-card border-[1.5px] border-border rounded-lg px-3 py-2.5 cursor-pointer text-xs font-semibold hover:bg-page"
                >
                    <TbArrowLeft />
                    <span>Back to Invoices</span>
                </button>

            </div>


            {/* warning box */}
            <div className="flex items-start gap-2 px-4 py-3 mx-5 bg-unpaid-bg border border-unpaid-border rounded-lg">

                <TbAlertTriangle className="shrink-0 mt-1" />

                <div>
                    <p className="text-sm font-bold text-unpaid">Deleted invoices are permanently removed after 30 days</p>
                    <p className="text-[13px] text-unpaid">You can restore invoices before they expire. Permanently deleted invoices cannot be recovered.</p>
                </div>
            </div>

            {selectedInvoiceIdsForDeletion.length > 0 && <SelectedInvoiceIdsActions />}

            <SoftDeletedInvoicesList />

        </main>
    )
}
