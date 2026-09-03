import toast from "react-hot-toast";
import { TbCheck, TbCornerDownLeft, TbTrash } from "react-icons/tb";
import invoiceStore from "../../../store/invoiceStore";

export default function SelectedInvoiceIdsActions() {

    const selectedInvoiceIdsForDeletion = invoiceStore((state) => state.selectedInvoiceIdsForDeletion)
    const emptySelectedInvoiceIdsForDeletion = invoiceStore((state) => state.emptySelectedInvoiceIdsForDeletion)
    const allInvoiceIdSelectedForDeletion = invoiceStore((state) => state.allInvoiceIdSelectedForDeletion)
    const isPerformingActionForDeletionPage = invoiceStore((state) => state.isPerformingActionForDeletionPage)
    const handleAllSelectedInvoicesForDeletion = invoiceStore((state) => state.handleAllSelectedInvoicesForDeletion)
    const deleteInvoicesPermanently = invoiceStore((state) => state.deleteInvoicesPermanently)
    const restoreInvoices = invoiceStore((state) => state.restoreInvoices)

    async function onRestore() {
        const res = await restoreInvoices(null)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    async function onDelete() {
        const res = await deleteInvoicesPermanently(null)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    return (
        <div className="px-5">
            <div className="flex flex-wrap items-center bg-navy-50 w-full rounded-[11px] p-3 gap-2">

                {/* checkbox */}
                <button
                    onClick={handleAllSelectedInvoicesForDeletion}
                    disabled={isPerformingActionForDeletionPage}
                    className={`shrink-0 flex justify-center items-center w-3.5 h-3.5 border-[1.5px] border-text-sm rounded-sm cursor-pointer ${allInvoiceIdSelectedForDeletion && "bg-navy-700 text-card border-none"} disabled:opacity-50 disabled:cursor-default`}>

                    {allInvoiceIdSelectedForDeletion &&
                        <TbCheck />
                    }
                </button>

                {/* selected count  */}
                <span className="text-sm text-text font-semibold">{selectedInvoiceIdsForDeletion.length} selected</span>

                {/* restore  */}
                <button
                    type="button"
                    onClick={onRestore}
                    disabled={isPerformingActionForDeletionPage}
                    className={`flex items-center gap-1 border-[1.5px] border-paid-border rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-paid-bg text-paid cursor-pointer disabled:opacity-50 disabled:cursor-default`}
                >
                    <TbCornerDownLeft size={13} />
                    <span>Restore</span>
                </button>

                {/* delete  */}
                <button
                    type="button"
                    onClick={onDelete}
                    disabled={isPerformingActionForDeletionPage}
                    className={`flex items-center gap-1 border-[1.5px] border-overdue rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-overdue-bg text-overdue cursor-pointer disabled:opacity-50 disabled:cursor-default`}
                >
                    <TbTrash />
                    <span>Delete Forever</span>
                </button>


                {/* cancel  */}
                <button
                    type="button"
                    onClick={() => emptySelectedInvoiceIdsForDeletion()}
                    disabled={isPerformingActionForDeletionPage}
                    className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-page disabled:opacity-50 disabled:cursor-default`}
                >
                    <span>Cancel</span>
                </button>

            </div>

        </div>
    )
}
