import { TbArrowLeft, TbPencil } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import clientStore from "../../../store/clientStore"
import toast from "react-hot-toast"
import { HiClipboard, HiTrash } from "react-icons/hi2"
import { useState } from "react"
import DeleteClientsContext from "../DeleteClientsContext"

export default function ActionButtons() {

    const navigate = useNavigate()

    const clientOverviewData = clientStore((state) => state.clientOverviewData)
    const isPerformingAction = clientStore((state) => state.isPerformingAction)
    const changeClientOverviewStatus = clientStore((state) => state.changeClientOverviewStatus)
    const deleteOverviewClient = clientStore((state) => state.deleteOverviewClient)

    const [showDeleteContextMenu, setShowDeleteContextMenu] = useState(false)

    async function handleChangeClientStatus(status: "active" | "inactive") {
        const res = await changeClientOverviewStatus(status)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    async function handleClientDeletion() {
        const res = await deleteOverviewClient()

        if (!res.success) {
            toast.error(res.message)
            return
        }

        setShowDeleteContextMenu(false)
        navigate("/clients")
        toast.success(res.message)
    }

    const clientStatus = clientOverviewData?.status

    return (
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 md:gap-0 px-5 mt-5">

            {/* back  */}
            <button
                type="button"
                onClick={() => navigate("/clients")}
                className="flex items-center gap-1 px-3 py-2 border-[1.5px] border-border rounded-[10px] text-xs text-text font-semibold bg-card cursor-pointer w-fit">
                <TbArrowLeft />
                <span>Back</span>
            </button>

            <div className="flex items-center gap-2">

                {/* edit  */}
                <button
                    type="button"
                    disabled={isPerformingAction}
                    className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-navy-50 disabled:opacity-50 disabled:cursor-default`}>
                    <TbPencil />
                    <span>Edit</span>
                </button>

                {/* status */}
                <button
                    type="button"
                    onClick={() => handleChangeClientStatus(clientStatus === "active" ? "inactive" : "active")}
                    disabled={isPerformingAction}
                    className={`flex items-center border-[1.5px] border-border rounded-[10px] px-3 py-2 font-semibold bg-card text-text text-xs cursor-pointer hover:bg-navy-50 disabled:opacity-50 disabled:cursor-default`}>
                    {clientStatus === "active" ? "Inactive" : "Active"}
                </button>

                {/* clone */}
                <button
                    type="button"
                    onClick={() => { }}
                    disabled={isPerformingAction}
                    className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-card text-text cursor-pointer disabled:opacity-50 disabled:cursor-default hover:bg-navy-50`}
                >
                    <HiClipboard />
                    <span>Clone</span>
                </button>

                {/* delete */}
                <button
                    type="button"
                    onClick={() => setShowDeleteContextMenu(true)}
                    disabled={isPerformingAction}
                    className={`flex items-center gap-1 border-[1.5px] border-overdue rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-overdue-bg text-overdue cursor-pointer disabled:opacity-50 disabled:cursor-default`}
                >
                    <HiTrash />
                    <span>Delete</span>
                </button>
            </div>

            {/* delete client context menu */}
            <DeleteClientsContext isOpen={showDeleteContextMenu} clientCount={1} onCancel={() => setShowDeleteContextMenu(false)} onDelete={handleClientDeletion} isDeleting={isPerformingAction} />

        </div>
    )
}
