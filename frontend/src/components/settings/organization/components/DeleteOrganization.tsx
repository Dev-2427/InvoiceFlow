import { useState } from "react"
import DeleteContextMenu from "./DeleteContextMenu"

interface DeleteOrganizationProp {
    organizationName: string,
    isDeletingOrganization: boolean,
    deleteOrganization: () => Promise<boolean>
}

export default function DeleteOrganization({ organizationName, isDeletingOrganization, deleteOrganization }: DeleteOrganizationProp) {

    const [openDeleteContextMenu, setOpenDeleteContextMenu] = useState(false)

    async function handleDeleteOrganization() {
        const success = await deleteOrganization()

        if (success) {
            setOpenDeleteContextMenu(false)
        }

    }

    return (
        <>
            <div className="px-5 max-w-2xl">
                {/* delete organization */}
                <div className="bg-card border-[1.5px] border-overdue-border rounded-[14px] px-5 py-3 space-y-4">

                    {/* header */}
                    <div>
                        <span className="text-overdue text-[15px] font-bold">Delete Organisation</span>
                        <p className="text-[13px] text-text-sm">Permanently remove this organisation and all its data</p>
                    </div>

                    <hr className="border border-border/70" />

                    <p className="text-[13px] text-text-sm">You are about to delete <span className="text-text font-bold">{organizationName}</span>. All invoices, clients, and reports will be permanently removed. Your other organisations will not be affected.</p>

                    <button
                        onClick={() => setOpenDeleteContextMenu(true)}
                        disabled={isDeletingOrganization}
                        type="button"
                        className="bg-overdue-bg text-overdue hover:bg-overdue-bg/90 rounded-lg py-2.5 w-full text-sm font-semibold cursor-pointer border-[1.5px] disabled:opacity-50 disabled:pointer-events-none">
                        {isDeletingOrganization ? "Deleting..." : " Delete Organization"}
                    </button>
                </div>

            </div>

            {openDeleteContextMenu &&
                <DeleteContextMenu
                    headerText={`Delete "${organizationName}"?`}
                    subText="This will permanently delete this organisation and all its invoices, clients and data. Other organisations in your account will not be affected."
                    deletionAllowedText={organizationName}
                    onCancel={() => setOpenDeleteContextMenu(false)}
                    onDelete={handleDeleteOrganization}
                    isDeletingOrganization={isDeletingOrganization}
                />
            }
        </>
    )
}
