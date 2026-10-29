import type { RevenueAndReceiptsChartFilter } from "../../types/dashboard.type"

const revenueChartFilterOptions: RevenueAndReceiptsChartFilter[] = [
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

interface RevenueChartAndReceiptsFilterMenuProps {
    onClick: (filter: RevenueAndReceiptsChartFilter) => void,
    revenueAndReceiptsChartFilter: RevenueAndReceiptsChartFilter
}

export default function RevenueChartAndReceiptsFilterMenu({ onClick, revenueAndReceiptsChartFilter }: RevenueChartAndReceiptsFilterMenuProps) {

    return (
        <div className="absolute top-full right-0 bg-card border border-border w-38 rounded-[10px] mt-1 overflow-hidden z-50">
            {revenueChartFilterOptions.map((option) => (
                <button
                    key={option.filter}
                    onClick={() => onClick(option)}
                    type="button"
                    className={`text-sm px-3 py-1.5  w-full cursor-pointer capitalize transition-colors duration-150 ${revenueAndReceiptsChartFilter.filter === option.filter ? "bg-navy-700 text-card" : "hover:bg-page bg-card text-text"}`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}
