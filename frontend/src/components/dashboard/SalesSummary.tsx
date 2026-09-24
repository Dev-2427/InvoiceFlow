import { formatCurrency } from "../../utils/formatCurrency"

interface SalesSummaryProps {
    salesSummary: {
        thisMonthReceipts: number,
        thisMonthRevenue: number,
        thisQuarterReceipts: number,
        thisQuarterRevenue: number,
        thisWeekReceipts: number,
        thisWeekRevenue: number,
        thisYearReceipts: number,
        thisYearRevenue: number,
        todayReceipts: number,
        todayRevenue: number
    },
    currencySymbol: string
}

export default function SalesSummary({ salesSummary, currencySymbol }: SalesSummaryProps) {
    return (
        <div className="mt-7 px-5">
            {/* invoice header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-0.75 h-4 bg-navy-700 rounded-lg" />
                <span className="text-text-sm font-bold text-[13px]">SALES SUMMARY</span>
            </div>


            <div className="bg-page border border-border rounded-t-[14px] overflow-hidden rounded-b-[14px]">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-150">

                        {/* table headers */}
                        <thead>
                            <tr className="border-b border-border text-xs text-text-sm">
                                <th className="px-5 py-3 text-left  font-bold"> PERIOD </th>
                                <th className="px-5 py-3 text-left font-bold"> SALES </th>
                                <th className="px-5 py-3 text-left font-bold"> RECEIPTS </th>
                            </tr>
                        </thead>

                        {/* table data */}
                        <tbody>
                            <tr
                                className="bg-card border-b border-border last:border-b-0 text-sm" >
                                <td className="px-5 py-3 font-bold text-navy-700"> Today </td>
                                <td className="px-5 py-3 text-text"> {currencySymbol}{formatCurrency(salesSummary.todayRevenue)} </td>
                                <td className="px-5 py-3 font-semibold text-paid"> {currencySymbol}{formatCurrency(salesSummary.todayReceipts)}</td>
                            </tr>

                            <tr
                                className="bg-card border-b border-border last:border-b-0 text-sm" >
                                <td className="px-5 py-3 font-bold text-navy-700"> This Week </td>
                                <td className="px-5 py-3 text-text"> {currencySymbol}{formatCurrency(salesSummary.thisWeekRevenue)} </td>
                                <td className="px-5 py-3 font-semibold text-paid"> {currencySymbol} {formatCurrency(salesSummary.thisWeekReceipts)} </td>
                            </tr>

                            <tr
                                className="bg-card border-b border-border last:border-b-0 text-sm" >
                                <td className="px-5 py-3 font-bold text-navy-700"> This Month </td>
                                <td className="px-5 py-3 text-text"> {currencySymbol}{formatCurrency(salesSummary.thisMonthRevenue)} </td>
                                <td className="px-5 py-3 font-semibold text-paid"> {currencySymbol} {formatCurrency(salesSummary.thisMonthReceipts)} </td>
                            </tr>

                            <tr
                                className="bg-card border-b border-border last:border-b-0 text-sm" >
                                <td className="px-5 py-3 font-bold text-navy-700"> This Quarter </td>
                                <td className="px-5 py-3 text-text"> {currencySymbol}{formatCurrency(salesSummary.thisQuarterRevenue)} </td>
                                <td className="px-5 py-3 font-semibold text-paid"> {currencySymbol} {formatCurrency(salesSummary.thisQuarterReceipts)} </td>
                            </tr>

                            <tr
                                className="bg-card border-b border-border last:border-b-0 text-sm" >
                                <td className="px-5 py-3 font-bold text-navy-700"> This Year </td>
                                <td className="px-5 py-3 text-text"> {currencySymbol}{formatCurrency(salesSummary.thisYearRevenue)} </td>
                                <td className="px-5 py-3 font-semibold text-paid"> {currencySymbol} {formatCurrency(salesSummary.thisYearReceipts)} </td>
                            </tr>


                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    )
}
