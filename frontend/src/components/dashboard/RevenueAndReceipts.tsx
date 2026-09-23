import { useRef, useState } from "react"
import dashboardStore from "../../store/dashboardStore"
import RevenueAndReceiptsChart from "../../components/dashboard/RevenueAndReceiptsChart";
import { TbChevronDown } from "react-icons/tb";
import RevenueChartAndReceiptsFilterMenu from "../../components/dashboard/RevenueChartAndReceiptsFilterMenu";

interface RevenueAndReceiptsProps {
    revenueAndReceiptsData: {
        year: number,
        month: string,
        revenue: number,
        receipts: number
    }[],
    currencySymbol: string
}

export default function RevenueAndReceipts({ revenueAndReceiptsData, currencySymbol }: RevenueAndReceiptsProps) {

    const setRevenueAndReceiptsChartFilter = dashboardStore((store) => store.setRevenueAndReceiptsChartFilter)
    const revenueChartAndReceiptsFilter = dashboardStore((store) => store.revenueChartAndReceiptsFilter)
    const [showRevenueAndReceiptsChartFilterMenu, setShowRevenueAndReceiptsChartFilterMenu] = useState(false)

    const revenueChartFilterMenuRef = useRef<HTMLDivElement>(null)

    return (
        <div className="px-5 space-y-5">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-0.75 h-4 bg-navy-700 rounded-lg" />
                <span className="text-text-sm font-bold text-[13px]">REVENUE & RECEIPTS</span>
            </div>

            <div className="bg-card border border-border rounded-[14px] space-y-1.5 py-3 px-5 h-full w-full">

                <div className="flex justify-between">

                    <div className=" space-y-1">
                        <p className="font-bold text-[15px] text-text">Revenue vs Receipts</p>
                        <p className="text-text-sm text-xs">Monthly comparision</p>
                    </div>

                    <div
                        ref={revenueChartFilterMenuRef}
                        className="relative">
                        <button
                            onClick={() => setShowRevenueAndReceiptsChartFilterMenu(prev => !prev)}
                            className="flex justify-center items-center gap-2 bg-navy-700 rounded-[10px] text-[12px] font-semibold text-card px-3 py-1.75 cursor-pointer capitalize">
                            {revenueChartAndReceiptsFilter.label}
                            <TbChevronDown className={`${showRevenueAndReceiptsChartFilterMenu && "rotate-180"}`} />
                        </button>

                        {showRevenueAndReceiptsChartFilterMenu && <RevenueChartAndReceiptsFilterMenu
                            onClick={(filter) => {
                                setRevenueAndReceiptsChartFilter(filter)
                                setShowRevenueAndReceiptsChartFilterMenu(false)
                            }}
                            revenueAndReceiptsChartFilter={revenueChartAndReceiptsFilter}
                        />}
                    </div>

                </div>

                <div className="flex items-center gap-3 my-3">

                    <div className="flex items-center gap-2">
                        <div className="bg-navy-200 h-3.5 w-3.5 rounded-sm" />
                        <span className="text-[13px] text-text-md">Revenue</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-gold h-3.5 w-3.5 rounded-sm" />
                        <span className="text-[13px] text-text-md">Receipts</span>
                    </div>
                </div>

                <RevenueAndReceiptsChart
                    data={revenueAndReceiptsData}
                    currencySymbol={currencySymbol}
                />

            </div>
        </div>
    )
}
