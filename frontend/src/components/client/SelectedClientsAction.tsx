import toast from "react-hot-toast";
import clientStore from "../../store/clientStore"
import { HiXMark, HiTrash } from "react-icons/hi2";
import { TbCheck, TbPencil } from "react-icons/tb";
import DeleteClientsContext from "./DeleteClientsContext";
import { useState } from "react";

export default function SelectedClientsAction() {

    const selectedClientIds = clientStore((state) => state.selectedClientIds)
    const emptySelectedClientsIds = clientStore((state) => state.emptySelectedClientsIds)
    const allClientIdSelected = clientStore((state) => state.allClientIdSelected)
    const handleSelectAllClients = clientStore((state) => state.handleSelectAllClients)
    const isPerformingAction = clientStore((state) => state.isPerformingAction)
    const changeClientStatus = clientStore((state) => state.changeClientStatus)
    const clientFilter = clientStore((state) => state.clientFilter)
    const deleteClients = clientStore((state) => state.deleteClients)

    const [showDeleteContextMenu, setShowDeleteContextMenu] = useState(false)

    async function handleChangeClientStatus(status: "active" | "inactive") {
        const res = await changeClientStatus(status)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    async function handleClientDeletion() {
        const res = await deleteClients()

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
                <span className="text-sm text-text font-semibold">{selectedClientIds.length} selected</span>

                {/* edit  */}
                {selectedClientIds.length === 1 &&
                    <button
                        type="button"
                        disabled={isPerformingAction}
                        className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-page disabled:opacity-50 disabled:cursor-default`}>
                        <TbPencil />
                        <span>Edit</span>
                    </button>
                }

                {/* active  */}
                {clientFilter.filter !== "active" &&
                    <button
                        type="button"
                        onClick={() => handleChangeClientStatus("active")}
                        disabled={isPerformingAction}
                        className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-page disabled:opacity-50 disabled:cursor-default`}>
                        <TbCheck />
                        <span>Active</span>
                    </button>
                }


                {/* inactive  */}
                {clientFilter.filter !== "inactive" &&
                    <button
                        type="button"
                        onClick={() => handleChangeClientStatus("inactive")}
                        disabled={isPerformingAction}
                        className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-page disabled:opacity-50 disabled:cursor-default`}>
                        <HiXMark />
                        <span>Inactive</span>
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
            <DeleteClientsContext isOpen={showDeleteContextMenu} clientCount={selectedClientIds.length} onCancel={() => setShowDeleteContextMenu(false)} onDelete={handleClientDeletion} isDeleting={isPerformingAction} />
        </div>
    )
}
