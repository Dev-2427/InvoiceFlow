import { TbCheck, TbArrowLeft, TbArrowRight } from "react-icons/tb";
import invoiceStore from "../../store/invoiceStore";
import { formatCurrency } from "../../utils/formatCurrency";
import formatLocalDate from "../../utils/dateUtils";
import { Link } from "react-router-dom";
import { HiTrash } from "react-icons/hi2";
import InvoicesCardSkeletons from "../loading/invoice/InvoicesCardSkeletons";
import type { InvoiceListData } from "../../types/invoice.types";

interface InvoicesListProps {
    invoices: InvoiceListData | null,
    showTrashPageLink: boolean,
    changePage: (page: number) => void,
    allowSelection: boolean
}

export default function InvoicesList({ invoices, showTrashPageLink, changePage, allowSelection }: InvoicesListProps) {

    const isGettingInvoices = invoiceStore((state) => state.isGettingInvoices)
    const changeSelectedInvoiceIds = invoiceStore((state) => state.changeSelectedInvoiceIds)
    const isPerformingAction = invoiceStore((state) => state.isPerformingAction)
    const selectedInvoiceIds = invoiceStore((state) => state.selectedInvoiceIds)

    if (isGettingInvoices) {
        return <InvoicesCardSkeletons />
    }

    if (!isGettingInvoices && invoices?.invoices.length === 0) {
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

    const page = invoices?.pagination.page || 1
    const totalPages = invoices?.pagination.totalPages || 1

    return (
        <div className="px-5 pb-3">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between items-center gap-3">

                {/* card  */}
                {invoices?.invoices.map((invoice) => {
                    const status = invoice.status
                    return (
                        <div
                            key={invoice._id}
                            className={`flex flex-col gap-2 bg-card border-[1.5px] border-border rounded-[14px]  p-4 shadow-lg ${selectedInvoiceIds.includes(invoice._id) && "border-navy-700"}`}
                        >


                            <div className="flex justify-between items-center">

                                {/* checkbox and invoice number */}
                                <div className="flex items-center gap-2">

                                    {allowSelection &&
                                        <button
                                            onClick={() => {

                                                if (isPerformingAction) return

                                                changeSelectedInvoiceIds(invoice._id)
                                            }
                                            }
                                            type="button"
                                            className={`shrink-0 flex justify-center items-center w-3.5 h-3.5 border-[1.5px] border-text-sm rounded-sm ${isPerformingAction ? "opacity-50 cursor-default" : "cursor-pointer"}  ${selectedInvoiceIds.includes(invoice._id) && "bg-navy-700 text-card border-none"}`}>

                                            {selectedInvoiceIds.includes(invoice._id) &&
                                                <TbCheck />
                                            }
                                        </button>
                                    }

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


                            <div className="flex justify-between items-start gap-2">

                                <div className="flex items-center gap-2 min-w-0">

                                    <div className="shrink-0 flex justify-center items-center bg-navy-700 text-card h-10 w-10 rounded-lg text-lg font-bold">
                                        {invoice.client.displayName.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-text capitalize">{invoice.client.displayName}</p>
                                        <p className={`truncate text-text-sm text-[13px] ${!invoice.client.companyName && "invisible"}`}>{invoice.client.companyName || "invisible"}</p>
                                    </div>

                                </div>



                            </div>

                            {/* amount */}
                            <div className="flex justify-between items-center px-4 py-3 bg-page rounded-lg">
                                <p className="text-text-xs font-bold text-xs">AMOUNT</p>
                                <p className="text-text text-md font-bold">{invoice.currency.symbol}{formatCurrency(invoice.totalAmount)}</p>
                            </div>

                            {/* issue date and due date */}
                            <div className="flex justify-between items-center">

                                <div>
                                    <p className="text-text-xs text-xs font-semibold">ISSUED</p>
                                    <p className="text-[13px] text-text-md font-semibold">{formatLocalDate(invoice.issueDate)}</p>
                                </div>

                                <div>
                                    <p className="text-text-sm text-xs font-semibold">DUE</p>
                                    <p className={`text-[13px] font-semibold ${status === "overdue" ? "text-overdue" : "text-text"}`}>{formatLocalDate(invoice.dueDate)}</p>
                                </div>

                            </div>


                            <hr className="border-border" />

                            {/* view button */}
                            <Link
                                to={`/invoices/${invoice._id}`}
                                className="flex justify-center items-center gap-1 self-end px-2.5 py-1.5 rounded-lg border-[1.5px] border-border cursor-pointer">
                                <span className="text-navy-700 text-[13px] font-semibold">View</span>

                                <TbArrowRight size={12} />
                            </Link>

                        </div>
                    )
                })}

            </div>

            {/* pagination  */}
            <div className="flex justify-end items-center gap-5 bg-card w-full border-[1.5px] border-border rounded-[14px] p-4 my-3">

                <p className="text-sm text-text-sm">Page {invoices?.pagination.page} of {invoices?.pagination.totalPages}</p>

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

            {/* restore invoice page link */}
            {
                showTrashPageLink &&
                <Link
                    to={"/invoices/restore"}
                    className="flex items-center justify-center gap-1 text-text-sm text-sm mt-5 mb-2">
                    <HiTrash />
                    <span>View Trash ({invoices?.deletedCount ?? 0})</span>
                </Link>
            }

        </div >
    )
}
