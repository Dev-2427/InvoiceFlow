import clientStore from "../../store/clientStore"
import { HiXMark, HiTrash } from "react-icons/hi2";
import { TbCheck, TbPencil } from "react-icons/tb";

export default function SelectedClientsAction() {

    const selectedClientIds = clientStore((state) => state.selectedClientIds)
    const emptySelectedClientsIds = clientStore((state) => state.emptySelectedClientsIds)

    return (
        <div className="px-5">
            <div className="flex flex-wrap items-center bg-navy-50 w-full rounded-[11px] p-3 gap-2">

                <span className="text-sm text-text font-semibold">{selectedClientIds.length} selected</span>

                {selectedClientIds.length > 0 &&
                    <button
                        type="button"
                        className="flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-page">
                        <TbPencil />
                        <span>Edit</span>
                    </button>
                }

                <button
                    type="button"
                    className="flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-page">
                    <TbCheck />
                    <span>Active</span>
                </button>

                <button
                    type="button"
                    className="flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-page">
                    <HiXMark />
                    <span>Inactive</span>
                </button>

                <button
                    type="button"
                    className="flex items-center gap-1 border-[1.5px] border-overdue rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-overdue-bg text-overdue cursor-pointer">
                    <HiTrash />
                    <span>Delete</span>
                </button>

                <button
                    type="button"
                    onClick={() => emptySelectedClientsIds()}
                    className="flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-xs text-[11px] font-semibold bg-card text-text cursor-pointer hover:bg-page">
                    <span>Cancel</span>
                </button>

            </div>

        </div>
    )
}
