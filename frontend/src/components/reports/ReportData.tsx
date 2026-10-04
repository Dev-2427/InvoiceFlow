import type { GetReportsData } from "../../types/reports.types"
import { formatCurrency } from "../../utils/formatCurrency"
import InvoicesList from "../invoice/InvoicesList"

interface ReportDataProps {
    reportData: GetReportsData | null,
    currency: {
        symbol: string,
        code: string
    },
    changePage: (page: number) => void
}

export default function ReportData({ reportData, currency, changePage }: ReportDataProps) {

    if (!reportData) {
        return (
            <div className="px-5 pb-5">
                <div className="space-y-5 w-full h-fit flex justify-center items-center bg-card border-[1.5px] border-border rounded-[14px] py-10">

                    <div className="flex flex-col justify-center items-center gap-3">

                        <div className="flex justify-center items-center h-12 w-12 rounded-[14px] bg-navy-50 text-xl">
                            📊
                        </div>

                        <p className="text-text-md font-bold text-[17px]">No report generated yet</p>

                        <div className="flex items-center gap-1">
                            <span className="text-text-sm text-[13px]">Select your filters above and click
                            </span>

                            <span className="text-text-sm font-bold text-sm">Fetch Report</span>
                        </div>

                    </div>

                </div>
            </div>
        )
    }

    const invoices = reportData.reportData

    const invoicesWithCurrency = invoices.invoices.map((invoice) => ({ ...invoice, currency }))

    const invoicesData = {
        invoices: invoicesWithCurrency,
        pagination: reportData.pagination
    }

    return (
        <div className="pb-5 space-y-5">

            {/* header */}
            <div className="flex items-center gap-2 mb-3 px-5">
                <div className="w-0.75 h-4 bg-navy-700 rounded-lg" />
                <span className="text-text-sm font-bold text-[13px]">REPORT RESULTS</span>
            </div>

            {/* totals */}
            <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-3 px-5">

                <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-2 ">
                    <p className="text-xs text-text-sm font-bold">TOTAL REVENUE</p>
                    <p className="text-lg font-bold text-navy-700">{currency.symbol}{formatCurrency(invoices.totalRevenue)}</p>
                </div>

                <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-2 ">
                    <p className="text-xs text-text-sm font-bold">TOTAL INVOICES</p>
                    <p className="text-lg font-bold text-navy-700">{invoices.totalInvoices}</p>
                </div>

                <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-2 ">
                    <p className="text-xs text-text-sm font-bold">TOTAL COLLECTED</p>
                    <p className="text-lg font-bold text-paid">{currency.symbol}{formatCurrency(invoices.totalCollected)}</p>
                </div>

                <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-2 ">
                    <p className="text-xs text-text-sm font-bold">TOTAL OVERDUE</p>
                    <p className="text-lg font-bold text-overdue">{currency.symbol}{formatCurrency(invoices.totalOverdue)}</p>
                </div>

            </div>

            {/* counts by invoice status */}
            <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-3 px-5">

                <div className="bg-paid-bg border-[1.5px] border-paid-border rounded-[14px] px-5 py-3 space-y-2">
                    <p className="text-xs text-paid font-bold">PAID</p>
                    <p className="text-lg font-bold text-paid">{invoices.invoicesCountsByStatus.paid}</p>
                </div>

                <div className="bg-unpaid-bg border-[1.5px] border-unpaid-border rounded-[14px] px-5 py-3 space-y-2 ">
                    <p className="text-xs text-unpaid font-bold">UNPAID</p>
                    <p className="text-lg font-bold text-unpaid">{invoices.invoicesCountsByStatus.unpaid}</p>
                </div>

                <div className="bg-draft-bg border-[1.5px] border-draft-border rounded-[14px] px-5 py-3 space-y-2  ">
                    <p className="text-xs text-draft font-bold">DRAFT</p>
                    <p className="text-lg font-bold text-draft">{invoices.invoicesCountsByStatus.draft}</p>
                </div>

                <div className="bg-overdue-bg border-[1.5px] border-overdue-border rounded-[14px] px-5 py-3 space-y-2">
                    <p className="text-xs text-overdue font-bold">OVERDUE</p>
                    <p className="text-lg font-bold text-overdue">{invoices.invoicesCountsByStatus.overdue}</p>
                </div>

            </div>

            {/* invoices */}
            <InvoicesList
                invoices={invoicesData}
                showTrashPageLink={false}
                changePage={(page) => changePage(page)}
                allowSelection={false}
            />
        </div>
    )
}
