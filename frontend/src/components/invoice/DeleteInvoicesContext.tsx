interface DeleteInvoicesContextProps {
    isOpen: boolean
    invoiceCount: number
    onCancel: () => void
    onDelete: () => void
    isDeleting: boolean
}

export default function DeleteInvoicesContext({
    isOpen,
    invoiceCount,
    onCancel,
    onDelete,
    isDeleting
}: DeleteInvoicesContextProps) {

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-5">

            <div className="w-full max-w-md bg-card border border-border rounded-[14px] p-6">

                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-text">
                        Delete {invoiceCount === 1 ? "invoice" : "invoices"}?
                    </h2>

                    <p className="text-sm text-text-sm">
                        {invoiceCount === 1
                            ? "This invoice will be moved to the trash."
                            : `These ${invoiceCount} invoices will be moved to the trash.`
                        }
                    </p>

                    <p className="text-sm text-text-sm">
                        You can restore {invoiceCount === 1 ? "it" : "them"} within 30 days.
                        After 30 days, {invoiceCount === 1 ? "it will" : "they will"} be permanently deleted.
                    </p>
                </div>

                <div className="flex justify-end gap-2 mt-6">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg border-[1.5px] border-border bg-card text-text text-sm font-semibold cursor-pointer hover:bg-page disabled:opacity-50 disabled:cursor-default"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 rounded-lg bg-overdue text-white text-sm font-semibold cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-default"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>
        </div>
    )
}