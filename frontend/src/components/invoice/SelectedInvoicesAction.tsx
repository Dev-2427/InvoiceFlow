import toast from "react-hot-toast";
import { HiTrash } from "react-icons/hi2";
import { TbCheck, TbPencilFilled } from "react-icons/tb";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import invoiceStore from "../../store/invoiceStore";
import DeleteInvoicesContext from "./DeleteInvoicesContext";

export default function SelectedInvoicesAction() {

    const selectedInvoiceIds = invoiceStore((state) => state.selectedInvoiceIds)
    const emptySelectedClientsIds = invoiceStore((state) => state.emptySelectedInvoiceIds)
    const allClientIdSelected = invoiceStore((state) => state.allInvoiceIdSelected)
    const handleSelectAllClients = invoiceStore((state) => state.handleSelectAllInvoices)
    const isPerformingAction = invoiceStore((state) => state.isPerformingAction)
    const deleteInvoices = invoiceStore((state) => state.deleteInvoices)

    const [showDeleteContextMenu, setShowDeleteContextMenu] = useState(false)

    const navigate = useNavigate()


    async function handleInvoiceDeletion() {
        const res = await deleteInvoices()

        if (!res.success) {
            toast.error(res.message)
            return
        }

        setShowDeleteContextMenu(false)
        toast.success(res.message)
    }

    return (
        <div className="px-5">
            <div className="flex flex-wrap items-center bg-navy-50 w-full rounded-[11px] p-3 gap-2">

                {/* checkbox */}
                <button
                    onClick={handleSelectAllClients}
                    disabled={isPerformingAction}
                    className={`shrink-0 flex justify-center items-center w-3.5 h-3.5 border-[1.5px] border-text-sm rounded-sm cursor-pointer ${allClientIdSelected && "bg-navy-700 text-card border-none"} disabled:opacity-50 disabled:cursor-default`}>

                    {allClientIdSelected &&
                        <TbCheck />
                    }
                </button>

                {/* selected count  */}
                <span className="text-sm text-text font-semibold">{selectedInvoiceIds.length} selected</span>

                {/* edit  */}
                {selectedInvoiceIds.length === 1 &&
                    <button
                        type="button"
                        onClick={() => navigate(`/invoices/${selectedInvoiceIds}/edit`)}
                        disabled={isPerformingAction}
                        className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-page disabled:opacity-50 disabled:cursor-default`}>
                        <TbPencilFilled />
                        <span>Edit</span>
                    </button>
                }


                {/* delete  */}
                <button
                    type="button"
                    onClick={() => setShowDeleteContextMenu(true)}
                    disabled={isPerformingAction}
                    className={`flex items-center gap-1 border-[1.5px] border-overdue rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-overdue-bg text-overdue cursor-pointer disabled:opacity-50 disabled:cursor-default`}
                >
                    <HiTrash />
                    <span>Delete</span>
                </button>

                {/* cancel  */}
                <button
                    type="button"
                    onClick={() => emptySelectedClientsIds()}
                    disabled={isPerformingAction}
                    className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-page disabled:opacity-50 disabled:cursor-default`}
                >
                    <span>Cancel</span>
                </button>

            </div>

            {/* delete context menu  */}
            <DeleteInvoicesContext
                isOpen={showDeleteContextMenu}
                onCancel={() => setShowDeleteContextMenu(false)}
                onDelete={() => { handleInvoiceDeletion() }}
                isDeleting={isPerformingAction}
                invoiceCount={selectedInvoiceIds.length}
            />
        </div>
    )
}
