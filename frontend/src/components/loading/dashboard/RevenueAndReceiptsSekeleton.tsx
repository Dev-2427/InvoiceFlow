export default function RevenueAndReceiptsSkeleton() {
    return (
        <div className="px-5 space-y-5 animate-pulse">

            {/* Section heading */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-0.75 h-4 bg-border rounded-lg" />
                <div className="h-4 w-36 bg-border rounded" />
            </div>

            {/* Chart card */}
            <div className="bg-card border border-border rounded-[14px] space-y-1.5 py-3 px-5">

                {/* Header */}
                <div className="flex justify-between">

                    <div className="space-y-2">
                        <div className="h-4 w-36 bg-border rounded" />
                        <div className="h-3 w-28 bg-border rounded" />
                    </div>

                    {/* Filter button */}
                    <div className="h-8 w-28 bg-border rounded-[10px]" />

                </div>


                {/* Legend */}
                <div className="flex items-center gap-3 my-3">

                    <div className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 bg-border rounded-sm" />
                        <div className="h-3 w-14 bg-border rounded" />
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="h-3.5 w-3.5 bg-border rounded-sm" />
                        <div className="h-3 w-14 bg-border rounded" />
                    </div>

                </div>


                {/* Chart */}
                <div className="w-full h-52">

                    <div className="relative h-full">

                        {/* Grid */}
                        <div className="absolute inset-0 flex flex-col justify-between pb-6">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="w-full border-t border-dashed border-border"
                                />
                            ))}
                        </div>


                        {/* Y-axis */}
                        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between py-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-3 w-7 bg-border rounded"
                                />
                            ))}
                        </div>


                        {/* Bars */}
                        <div className="absolute left-10 right-2 bottom-6 top-2 flex items-end justify-between">

                            {[
                                ["h-24", "h-16"],
                                ["h-16", "h-12"],
                                ["h-28", "h-20"],
                                ["h-20", "h-14"],
                                ["h-32", "h-24"],
                                ["h-14", "h-10"],
                                ["h-20", "h-16"],
                                ["h-28", "h-18"],
                                ["h-16", "h-12"],
                                ["h-24", "h-18"],
                                ["h-28", "h-20"],
                                ["h-20", "h-15"],
                            ].map(([revenueHeight, receiptsHeight], index) => (
                                <div
                                    key={index}
                                    className="flex items-end gap-1"
                                >
                                    <div
                                        className={`w-2.5 sm:w-4 ${revenueHeight} bg-border rounded-t`}
                                    />
                                    <div
                                        className={`w-2.5 sm:w-4 ${receiptsHeight} bg-border rounded-t`}
                                    />
                                </div>
                            ))}

                        </div>


                        {/* X-axis labels */}
                        <div className="absolute left-10 right-2 bottom-0 flex justify-between">
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-3 w-5 bg-border rounded"
                                />
                            ))}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}