import { useEffect } from "react"
import invoiceStore from "../../../store/invoiceStore"
import toast from "react-hot-toast"
import { TbArrowLeft, TbArrowRight, TbCheck, TbCornerDownLeft, TbHourglassLow, TbTrash } from "react-icons/tb"
import { formatCurrency } from "../../../utils/formatCurrency"
import formatLocalDate from "../../../utils/dateUtils"
import SoftDeletedInvoicesCardSkeleton from "../../loading/invoice/SoftDeletedInvoicesCardSkeleton"
import getRemainingDays from "../../../utils/getRemainingDays"
import { NavLink } from "react-router-dom"

export default function SoftDeletedInvoicesList() {

    const isPerformingActionForDeletionPage = invoiceStore((state) => state.isPerformingActionForDeletionPage)
    const changeSelectedInvoiceIdsForDeletion = invoiceStore((state) => state.changeSelectedInvoiceIdsForDeletion)
    const emptySelectedInvoiceIdsForDeletion = invoiceStore((state) => state.emptySelectedInvoiceIdsForDeletion)
    const selectedInvoiceIdsForDeletion = invoiceStore((state) => state.selectedInvoiceIdsForDeletion)
    const softDeletedInvoices = invoiceStore((state) => state.softDeletedInvoices)
    const getSoftDeletedInvoices = invoiceStore((state) => state.getSoftDeletedInvoices)
    const restoreInvoices = invoiceStore((state) => state.restoreInvoices)
    const deleteInvoicesPermanently = invoiceStore((state) => state.deleteInvoicesPermanently)
    const isGettingSoftDeletedInvoices = invoiceStore((state) => state.isGettingSoftDeletedInvoices)

    const page = softDeletedInvoices?.pagination.page || 1
    const totalPages = softDeletedInvoices?.pagination.totalPages || 1

    function changePage(newPage: number) {
        emptySelectedInvoiceIdsForDeletion()
        getSoftDeletedInvoices(newPage)
    }

    useEffect(() => {
        async function fetchSoftDeletedInvoices() {
            const res = await getSoftDeletedInvoices(1)

            if (!res.success) {
                toast.error(res.message)
                return
            }
        }

        fetchSoftDeletedInvoices()
    }, [])

    async function onRestore(id: string) {
        const res = await restoreInvoices(id)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    async function onDelete(id: string) {
        const res = await deleteInvoicesPermanently(id)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    if (isGettingSoftDeletedInvoices) {
        return <SoftDeletedInvoicesCardSkeleton />
    }

    if (!isGettingSoftDeletedInvoices && softDeletedInvoices?.invoices.length === 0) {
        return (
            <div className="px-5">
                <div className="flex min-h-48 w-full items-center justify-center rounded-[14px] border-[1.5px] border-border bg-card">
                    <p className="text-sm text-text-sm">
                        No invoices found.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between items-center gap-3 mx-5">

                {/* card  */}
                {softDeletedInvoices?.invoices.map((invoice) => {
                    const status = invoice.status
                    return (
                        <NavLink
                            to={`/invoices/${invoice._id}`}
                            key={invoice._id}
                            className={`flex flex-col gap-2 bg-card border-[1.5px] border-border rounded-[14px]  p-4 shadow-lg ${selectedInvoiceIdsForDeletion.includes(invoice._id) && "border-navy-700"}`}

                        >


                            <div className="flex justify-between items-center">

                                {/* checkbox and invoice number */}
                                <div className="flex items-center gap-2">

                                    <button
                                        onClick={(e) => {
                                            if (isPerformingActionForDeletionPage) return

                                            e.preventDefault()
                                            e.stopPropagation()

                                            changeSelectedInvoiceIdsForDeletion(invoice._id)
                                        }
                                        }
                                        type="button"
                                        className={`shrink-0 flex justify-center items-center w-3.5 h-3.5 border-[1.5px] border-text-sm rounded-sm ${isPerformingActionForDeletionPage ? "opacity-50 cursor-default" : "cursor-pointer"}  ${selectedInvoiceIdsForDeletion.includes(invoice._id) && "bg-navy-700 text-card border-none"}`}>

                                        {selectedInvoiceIdsForDeletion.includes(invoice._id) &&
                                            <TbCheck />
                                        }
                                    </button>

                                    <span className="text-navy-700 font-bold text-[13px]">{invoice.invoiceNumber}</span>
                                </div>

                                {/* invoice status */}
                                <div
                                    className={`flex justify-center items-center gap-1 border ${status === "overdue" ? "border-overdue-border bg-overdue-bg" : status === "paid" ? "border-paid-border bg-paid-bg" : status === "unpaid" ? "border-unpaid-border bg-unpaid-bg" : "border-draft-border bg-draft-bg"} rounded-[14px] px-2 py-1`}>

                                    <div className={`${status === "overdue" ? "bg-overdue" : status === "paid" ? "bg-paid" : status === "unpaid" ? "bg-unpaid" : "bg-draft"} w-1.5 h-1.5 rounded-full`} />

                                    <span
                                        className={`${status === "overdue" ? "text-overdue" : status === "paid" ? "text-paid" : status === "unpaid" ? "text-unpaid" : "text-draft"} text-[11px] font-bold capitalize`}
                                    >{status}</span>
                                </div>

                            </div>

                            {/* display name and company name */}
                            <div className="flex justify-between items-start gap-2">

                                <div className="flex items-center gap-2 min-w-0">

                                    <div className="shrink-0 flex justify-center items-center bg-text-xs text-card h-10 w-10 rounded-lg text-lg font-bold">
                                        {invoice.client.displayName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-text capitalize">{invoice.client.displayName}</p>
                                        <p className={`truncate text-text-sm text-[13px] ${!invoice.client.companyName && "invisible"}`}>{invoice.client.companyName || "invisible"}</p>
                                    </div>

                                </div>



                            </div>

                            {/* amount and deletion date*/}
                            <div className="flex justify-between items-start px-4 py-3 bg-page rounded-lg">

                                <div>
                                    <p className="text-text-xs font-bold text-xs">AMOUNT</p>
                                    <p className="text-text-md text-md font-bold">{invoice.currency.symbol}{formatCurrency(invoice.totalAmount)}</p>
                                </div>

                                <div>
                                    <p className="text-text-xs font-bold text-xs">DELETED ON</p>
                                    <p className="text-overdue text-[12px] font-bold">{formatLocalDate(invoice.deletedAt)}</p>
                                </div>

                            </div>

                            {/* remaining days count */}
                            <div className="flex justify-between items-center gap-2 px-4 py-3 bg-unpaid-bg border border-unpaid-border rounded-lg">

                                <div className="flex items-center gap-2">
                                    <TbHourglassLow className="shrink-0 mt-1 text-unpaid" />

                                    <span className="text-unpaid text-[13px] font-bold">{getRemainingDays(invoice.deletedAt)} days left</span>
                                </div>

                                <span className="text-xs text-unpaid">before permanent deletion</span>


                            </div>


                            {/* issue date and due date */}
                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-text-sm text-xs font-semibold">ISSUED</p>
                                    <p className="text-[13px] text-text font-semibold">{formatLocalDate(invoice.issueDate)}</p>
                                </div>

                                <div>
                                    <p className="text-text-sm text-xs font-semibold">DUE</p>
                                    <p className={`text-[13px] font-semibold ${status === "overdue" ? "text-overdue" : "text-text"}`}>{formatLocalDate(invoice.dueDate)}</p>
                                </div>

                            </div>


                            <hr className="border-border" />

                            {/* restore and delete button */}
                            <div className="flex items-center w-full gap-3">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        onRestore(invoice._id)
                                    }}
                                    disabled={isPerformingActionForDeletionPage}
                                    className="flex justify-center items-center gap-1 self-end w-1/2 bg-paid-bg px-2.5 py-1.5 rounded-lg border-[1.5px] border-paid-border cursor-pointer disabled:opacity-50">

                                    <TbCornerDownLeft size={14} className="text-paid " />
                                    <span className="text-paid text-[13px] font-semibold">Restore</span>
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        onDelete(invoice._id)
                                    }}
                                    disabled={isPerformingActionForDeletionPage}
                                    className="flex justify-center items-center gap-1 self-end w-1/2 bg-overdue-bg px-2.5 py-1.5 rounded-lg border-[1.5px] border-overdue-border cursor-pointer disabled:opacity-50">

                                    <TbTrash size={12} className="text-overdue" />
                                    <span className="text-overdue text-[13px] font-semibold">Delete Forever</span>
                                </button>
                            </div>

                        </NavLink>
                    )
                })}

            </div>

            {/* pagination  */}
            <div className="flex justify-end items-center gap-5 bg-card border-[1.5px] border-border rounded-[14px] p-4 my-3 mx-5">

                <p className="text-sm text-text-sm">Page {softDeletedInvoices?.pagination.page} of {softDeletedInvoices?.pagination.totalPages}</p>

                <div className="flex items-center gap-2">

                    <button
                        onClick={() => changePage(page - 1)}
                        type="button"
                        disabled={page === 1}
                        className="flex justify-center items-center border-[1.8px] border-border rounded-xl h-8 w-8 cursor-pointer text-sm text-text disabled:opacity-50 disabled:cursor-auto">
                        <TbArrowLeft />
                    </button>

                    {page > 1 &&
                        <button
                            onClick={() => changePage(page - 1)}
                            type="button"
                            className="flex justify-center items-center border-[1.5px] border-border rounded-xl h-8 w-8 text-text-text cursor-pointer bg-card text-text">
                            {page - 1}
                        </button>
                    }

                    <div
                        className={`flex justify-center items-center border-[1.8px] border-border rounded-xl h-8 w-8 text-text-text cursor-pointer bg-navy-700 text-sm text-card `}>
                        {page}
                    </div>

                    {page < totalPages &&
                        <button
                            onClick={() => changePage(page + 1)}
                            type="button"
                            className="flex justify-center items-center border-[1.8px] border-border rounded-xl h-8 w-8 cursor-pointer text-sm text-text">
                            {page + 1}
                        </button>
                    }

                    <button
                        onClick={() => changePage(page + 1)}
                        type="button"
                        disabled={page === totalPages}
                        className="flex justify-center items-center border-[1.8px] border-border rounded-xl h-8 w-8 cursor-pointer text-sm text-text disabled:opacity-50 disabled:cursor-auto">
                        <TbArrowRight />
                    </button>

                </div>
            </div>
        </>
    )
}
