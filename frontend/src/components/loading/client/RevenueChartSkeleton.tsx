export default function RevenueChartSkeleton() {
    return (
        <div className="w-full h-52 animate-pulse">

            <div className="h-full flex">

                {/* Y axis */}
                <div className="w-11 shrink-0 flex flex-col justify-between py-3 pr-2">
                    <div className="h-3 w-7 bg-border rounded ml-auto" />
                    <div className="h-3 w-9 bg-border rounded ml-auto" />
                    <div className="h-3 w-7 bg-border rounded ml-auto" />
                    <div className="h-3 w-9 bg-border rounded ml-auto" />
                    <div className="h-3 w-7 bg-border rounded ml-auto" />
                </div>

                {/* Chart area */}
                <div className="flex-1 flex flex-col min-w-0">

                    {/* Grid */}
                    <div className="flex-1 relative">

                        <div className="absolute inset-x-0 top-[10%] border-t border-dashed border-border" />
                        <div className="absolute inset-x-0 top-[30%] border-t border-dashed border-border" />
                        <div className="absolute inset-x-0 top-[50%] border-t border-dashed border-border" />
                        <div className="absolute inset-x-0 top-[70%] border-t border-dashed border-border" />
                        <div className="absolute inset-x-0 top-[90%] border-t border-dashed border-border" />

                    </div>

                    {/* X axis */}
                    <div className="flex justify-between px-2 pt-2">
                        {Array.from({ length: 12 }).map((_, index) => (
                            <div
                                key={index}
                                className="h-3 w-6 bg-border rounded"
                            />
                        ))}
                    </div>

                </div>

            </div>

        </div>
    )
}