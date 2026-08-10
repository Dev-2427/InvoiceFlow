import { HiExclamationTriangle, HiTrash, HiXMark } from "react-icons/hi2";

interface DeleteClientsContextProps {
    isOpen: boolean;
    clientCount: number;
    isDeleting: boolean;
    onCancel: () => void;
    onDelete: () => void;
}

export default function DeleteClientsContext({
    isOpen,
    clientCount,
    isDeleting,
    onCancel,
    onDelete,
}: DeleteClientsContextProps) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">

            <div className="w-full max-w-md overflow-hidden rounded-[14px] border-[1.5px] border-border bg-card shadow-xl">

                {/* Header */}
                <div className="flex items-start justify-between p-5">

                    <div className="flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-overdue-bg text-overdue">
                            <HiExclamationTriangle className="text-xl" />
                        </div>

                        <div>
                            <h2 className="font-bold text-text">
                                Delete {clientCount === 1 ? "client" : "clients"}?
                            </h2>

                            <p className="mt-1 text-sm text-text-sm">
                                This action cannot be undone.
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-text-sm cursor-pointer hover:bg-page disabled:cursor-default disabled:opacity-50"
                    >
                        <HiXMark className="text-lg" />
                    </button>

                </div>


                {/* Warning */}
                <div className="mx-5 rounded-lg border-[1.5px] border-overdue-border bg-overdue-bg p-3">
                    <p className="text-sm font-semibold text-overdue">
                        Warning
                    </p>

                    <p className="mt-1 text-sm text-text-sm">
                        Deleting {clientCount === 1 ? "this client" : "these clients"} will also permanently delete
                        all invoices associated with {clientCount === 1 ? "the client" : "these clients"}.
                    </p>
                </div>


                {/* Actions */}
                <div className="flex justify-end gap-2 p-5">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="rounded-[10px] border-[1.5px] border-border bg-card px-4 py-2 text-sm font-semibold text-text cursor-pointer hover:bg-page disabled:cursor-default disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="flex min-w-20 items-center justify-center gap-1 rounded-[10px] bg-overdue px-4 py-2 text-sm font-semibold text-card cursor-pointer hover:bg-overdue/90 disabled:cursor-default disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-card border-t-transparent" />
                        ) : (
                            <>
                                <HiTrash />
                                <span>Delete</span>
                            </>
                        )}
                    </button>

                </div>

            </div>
        </div>
    );
}