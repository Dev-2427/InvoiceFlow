import { useState } from "react";
import { TbAlertTriangle } from "react-icons/tb";

interface DeleteContextMenuProps {
  headerText: string,
  subText: string,
  onCancel: () => void,
  onDelete: () => Promise<void>,
  deletionAllowedText: string,
  isDeletingOrganization: boolean
}

export default function DeleteContextMenu({ deletionAllowedText, headerText, onCancel, onDelete, subText, isDeletingOrganization }: DeleteContextMenuProps) {

  const [inputText, setInputText] = useState("")

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-xs z-50">

      <div className="w-md space-y-5 p-5 bg-card rounded-[14px]">


        <div className="flex gap-3">

          <div className="flex justify-center items-center
          text-xl h-11 w-11 bg-overdue-bg rounded-lg shrink-0">
            <TbAlertTriangle />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-text font-bold text-[17px]">{headerText}</span>
            <p className="text-text-sm text-[13px]">{subText}</p>
          </div>

        </div>

        <div className="flex flex-col gap-2 bg-overdue-bg rounded-[14px] px-5 py-3">

          <span className="text-overdue text-[13px]">Type <span className="font-bold">{deletionAllowedText}</span> to confirm</span>

          <input
            type="text"
            onChange={(e) => setInputText(e.target.value)}
            className="w-full rounded-lg border-[1.5px] border-border bg-card px-3 py-2.5 text-text-sm text-sm"
            placeholder="Type organization name"
          />

        </div>


        <div className="flex items-center gap-2">

          <button
            onClick={onCancel}
            disabled={isDeletingOrganization}
            type="button"
            className="bg-card text-navy-700 rounded-lg py-2.5 text-sm font-bold cursor-pointer border-[1.5px] border-border disabled:opacity-50 disabled:pointer-events-none w-1/2">
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={isDeletingOrganization || deletionAllowedText !== inputText}
            type="button"
            className="bg-overdue text-card hover:bg-overdue/90 rounded-lg py-2.5 text-sm font-bold cursor-pointer border-[1.5px] disabled:opacity-50 disabled:pointer-events-none w-1/2">
            {isDeletingOrganization ? "Deleting..." : " Delete Organization"}
          </button>

        </div>


      </div>

    </div>
  )
}
