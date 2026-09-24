import type { RevenueData } from "../../../types/client.types"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { formatCompactCurrency } from "../../../utils/formatCompactCurrency"
import { formatCurrency } from "../../../utils/formatCurrency"

interface ChartRevenueProps {
    revenueData: RevenueData[]
    currencySymbol: string
}

export default function RevenueChart({
    revenueData,
    currencySymbol,
}: ChartRevenueProps) {
    return (
        <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={revenueData}
                    margin={{
                        top: 10,
                        right: 5,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fontSize: 11,
                        }}
                        interval={0}
                        padding={{
                            left: 8,
                            right: 8,
                        }}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={45}
                        tick={{
                            fontSize: 11,
                        }}
                        tickFormatter={(value) =>
                            formatCompactCurrency(
                                Number(value),
                                currencySymbol
                            )
                        }
                    />

                    <Tooltip
                        cursor={{
                            fill: "transparent",
                        }}
                        formatter={(value) => [
                            `${currencySymbol}${formatCurrency(Number(value))}`,
                            "Revenue",
                        ]}
                        labelFormatter={(label) => `${label}`}
                    />

                    <Bar
                        dataKey="revenue"
                        name="Revenue"
                        fill="var(--color-gold)"
                        maxBarSize={30}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}