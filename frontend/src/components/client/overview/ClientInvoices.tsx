import { useNavigate } from "react-router-dom"
import type { GetClientInvoicesData } from "../../../types/client.types"
import formatLocalDate from "../../../utils/dateUtils"
import { formatCurrency } from "../../../utils/formatCurrency"
import { TbArrowLeft, TbArrowRight } from "react-icons/tb"

interface ClientInvoicesProps {
  data: GetClientInvoicesData,
  currencySymbol: string,
  changePage: (newPage: number) => void
}

export default function ClientInvoices({ data, currencySymbol, changePage }: ClientInvoicesProps) {

  const navigate = useNavigate()

  const page = data.pagination.page
  const totalPages = data.pagination.totalPages

  return (
    <div className="mt-7">
      {/* invoice header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-0.75 h-4 bg-navy-700 rounded-lg" />
        <span className="text-text-sm font-bold text-[13px]">INVOICES</span>
      </div>


      <div className="bg-page border border-border rounded-t-[14px] overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-150">

            {/* table headers */}
            <thead>
              <tr className="border-b border-border text-xs text-text-sm">
                <th className="px-5 py-3 text-left  font-bold"> INVOICE </th>
                <th className="px-5 py-3 text-left font-bold"> DATE </th>
                <th className="px-5 py-3 text-left font-bold"> AMOUNT </th>
                <th className="px-5 py-3 text-left font-bold"> STATUS </th>
              </tr>
            </thead>

            {/* table data */}
            <tbody>
              {data.invoices.map((invoice) => {
                const status = invoice.status
                return (
                  <tr
                    key={invoice._id}
                    onClick={() => navigate(`/invoices/${invoice._id}`)}
                    className="bg-card border-b border-border last:border-b-0 text-sm cursor-pointer hover:bg-page" >
                    <td className="px-5 py-3 font-bold text-navy-700"> {invoice.invoiceNumber} </td>
                    <td className="px-5 py-3 text-text-sm"> {formatLocalDate(invoice.issueDate)} </td>
                    <td className="px-5 py-3 font-semibold text-text"> {currencySymbol}{formatCurrency(invoice.totalAmount)} </td>

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

          {/* pagination  */}
          <div className="flex justify-end items-center gap-5 bg-card w-full border border-t-0 border-border rounded-b-[14px] p-4">

            <p className="text-sm text-text-sm">Page {page} of {totalPages}</p>

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

    </div>
  )
}
