import { TbArrowRight } from "react-icons/tb"
import formatLocalDate from "../../utils/dateUtils"
import { formatCurrency } from "../../utils/formatCurrency"
import { useNavigate } from "react-router-dom"

interface RecentInvoicesProps {
    recentInvoices: {
        _id: string,
        client: {
            displayName: string,
            companyName: string
        },
        currency: {
            code: string,
            symbol: string
        },
        dueDate: string,
        invoiceNumber: string,
        status: string,
        totalAmount: number
    }[]
}

export default function RecentInvoices({ recentInvoices }: RecentInvoicesProps) {

    const navigate = useNavigate()

    return (
        <div className="mt-7 px-5">
            {/* invoice header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-0.75 h-4 bg-navy-700 rounded-lg" />
                <span className="text-text-sm font-bold text-[13px]">RECENT INVOICES</span>
            </div>

            <div className="flex justify-between items-center bg-card rounded-t-[14px] px-5 py-3.5">
                <p className="text-text font-bold text-sm">Latest Activity</p>

                <button
                    onClick={() => navigate("/invoices")}
                    type="button"
                    className="flex items-center gap-1 text-navy-700 font-bold text-[13px] cursor-pointer"
                >
                    <span>View all</span>
                    <TbArrowRight />
                </button>
            </div>
            <div className="bg-page border border-border overflow-hidden rounded-b-[14px]">

                <div className="overflow-x-auto max-w-full">

                    <table className="w-full min-w-225 table-fixed">

                        {/* table headers */}
                        <thead>
                            <tr className="border-b border-border text-xs text-text-sm">
                                <th className="px-5 py-3 text-left font-bold w-30"> INVOICE </th>
                                <th className="px-5 py-3 text-left font-bold w-70"> CLIENT </th>
                                <th className="px-5 py-3 text-left font-bold w-37.5"> AMOUNT</th>
                                <th className="px-5 py-3 text-left font-bold w-37.5">DUE</th>
                                <th className="px-5 py-3 text-left font-bold w-30">STATUS</th>
                            </tr>
                        </thead>

                        {/* table data */}
                        <tbody>
                            {recentInvoices.map((invoice) => {
                                const status = invoice.status
                                return (

                                    <tr
                                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                                        key={invoice._id}
                                        className="bg-card border-b border-border last:border-b-0 text-sm cursor-pointer hover:bg-page transition-colors duration-150" >
                                        <td className="px-5 py-3 text-navy-700 font-bold">{invoice.invoiceNumber} </td>
                                        <td className="px-5 py-3">
                                            <p className="text-text font-semibold text-sm wrap-break-word">{invoice.client.displayName}</p>
                                            <p className="text-text-sm text-xs wrap-break-word">{invoice.client.companyName}</p>
                                        </td>
                                        <td className="px-5 py-3 text-text font-semibold">{invoice.currency.symbol}{formatCurrency(invoice.totalAmount)} </td>
                                        <td className="px-5 py-3 text-text-sm">{formatLocalDate(invoice.dueDate)} </td>

                                        <td className="px-5 py-3 capitalize">
                                            <div
                                                className={`flex items-center  gap-1 border ${status === "overdue" ? "border-overdue-border bg-overdue-bg" : status === "paid" ? "border-paid-border bg-paid-bg" : status === "unpaid" ? "border-unpaid-border bg-unpaid-bg" : "border-draft-border bg-draft-bg"} rounded-[14px] px-2 py-1 w-fit`}>

                                                <div className={`${status === "overdue" ? "bg-overdue" : status === "paid" ? "bg-paid" : status === "unpaid" ? "bg-unpaid" : "bg-draft"} w-1.5 h-1.5 rounded-full`} />

                                                <span
                                                    className={`${status === "overdue" ? "text-overdue" : status === "paid" ? "text-paid" : status === "unpaid" ? "text-unpaid" : "text-draft"} text-[11px] font-bold capitalize`}
                                                >{status}</span>
                                            </div>
                                        </td>

                                    </tr>

                                )
                            })}
                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}
