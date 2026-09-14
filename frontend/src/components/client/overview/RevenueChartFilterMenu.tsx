import clientStore from "../../../store/clientStore"
import type { RevenueCHartFilter } from "../../../types/client.types"

const revenueChartFilterOptions: RevenueCHartFilter[] = [
    {
        label: "current year",
        filter: "current_year"
    },
    {
        label: "previous year",
        filter: "previous_year"
    },
    {
        label: "past 12 months",
        filter: "past_12_months"
    }
]

interface RevenueChartFilterMenuProps {
    onClick: (filter: RevenueCHartFilter) => void
}

export default function RevenueChartFilterMenu({ onClick }: RevenueChartFilterMenuProps) {

    const revenueChartFilter = clientStore((state) => state.revenueChartFilter)

    return (
        <div className="absolute top-full right-0 bg-card border border-border w-38 rounded-[10px] mt-1 overflow-hidden z-50">
            {revenueChartFilterOptions.map((option) => (
                <button
                key={option.filter}
                    onClick={() => onClick(option)}
                    type="button"
                    className={`text-sm px-3 py-1.5  w-full cursor-pointer capitalize ${revenueChartFilter.filter === option.filter ? "bg-navy-700 text-card" : "hover:bg-page bg-card text-text"}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}
