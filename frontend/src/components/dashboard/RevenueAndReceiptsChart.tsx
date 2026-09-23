import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { formatCompactCurrency } from "../../utils/formatCompactCurrency"
import { formatCurrency } from "../../utils/formatCurrency"

interface RevenueAndReceiptsChartProps {
    data: {
        year: number
        month: string
        revenue: number
        receipts: number
    }[]
    currencySymbol: string
}

export default function RevenueAndReceiptsChart({
    data,
    currencySymbol,
}: RevenueAndReceiptsChartProps) {
    return (
        <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 5, left: 0, bottom: 5 }}
                    barGap={3}
                >
                    <CartesianGrid
                        vertical={false}
                        strokeDasharray="3 3"
                    />

                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                        interval={0}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        width={45}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) =>
                            formatCompactCurrency(
                                Number(value),
                                currencySymbol
                            )
                        }
                    />

                    <Tooltip
                        cursor={{ fill: "transparent" }}
                        formatter={(value, name) => [
                            `${currencySymbol}${formatCurrency(Number(value))}`,
                            name,
                        ]}
                    />

                    <Bar
                        dataKey="revenue"
                        name="Revenue"
                        fill="var(--color-navy-200)"
                        radius={[4, 4, 0, 0]}
                    />

                    <Bar
                        dataKey="receipts"
                        name="Receipts"
                        fill="var(--color-gold)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}