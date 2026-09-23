export default function DashboardSkeleton() {
    return (
        <div className="space-y-5 mb-4 animate-pulse">

            {/* Dashboard Header */}
            <div className="px-5 pt-4">
                <div className="flex justify-between items-center">

                    {/* Welcome back */}
                    <div className="h-7 w-34 bg-border rounded-md" />

                    {/* Create button */}
                    <div className="h-9 w-24 bg-border rounded-lg" />

                </div>

                {/* Organization + date */}
                <div className="h-4 w-44 bg-border rounded mt-2" />
            </div>


            {/* Overview */}
            <div className="px-5 space-y-5">

                {/* Section heading */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-0.75 h-4 bg-border rounded-lg" />
                    <div className="h-4 w-20 bg-border rounded" />
                </div>

                {/* Overview cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-3">

                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="space-y-3 bg-card border-[1.5px] border-border rounded-[14px] px-5 py-4"
                        >

                            <div className="h-3 w-28 bg-border rounded" />

                            <div className="space-y-2">

                                <div className="h-6 w-28 bg-border rounded" />

                                <div className="h-3 w-32 bg-border rounded" />
                            </div>
                        </div>
                    ))}

                </div>
            </div>


            {/* Revenue & Receipts */}
            <div className="px-5 space-y-5">

                {/* Section heading */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-0.75 h-4 bg-border rounded-lg" />
                    <div className="h-4 w-36 bg-border rounded" />
                </div>

                {/* Chart card */}
                <div className="bg-card border border-border rounded-[14px] py-3 px-5">

                    {/* Chart header */}
                    <div className="flex justify-between">

                        <div className="space-y-2">
                            <div className="h-4 w-36 bg-border rounded" />
                            <div className="h-3 w-28 bg-border rounded" />
                        </div>

                        {/* Filter */}
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

                        <div className="relative h-full flex flex-col justify-between">

                            {/* Horizontal grid lines */}
                            <div className="absolute inset-0 flex flex-col justify-between py-2">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="w-full border-t border-dashed border-border"
                                    />
                                ))}
                            </div>

                            {/* Fake bars */}
                            <div className="relative h-full flex items-end justify-between px-2 pb-6">

                                {[
                                    "h-24",
                                    "h-16",
                                    "h-28",
                                    "h-20",
                                    "h-32",
                                    "h-14",
                                    "h-0",
                                    "h-0",
                                    "h-0",
                                    "h-0",
                                    "h-0",
                                    "h-0",
                                ].map((height, index) => (
                                    <div
                                        key={index}
                                        className="flex items-end gap-1"
                                    >
                                        <div
                                            className={`w-3 sm:w-5 ${height} bg-border rounded-t`}
                                        />
                                        <div
                                            className={`w-3 sm:w-5 ${height === "h-0" ? "h-0" : index % 2 === 0 ? "h-16" : "h-10"} bg-border rounded-t`}
                                        />
                                    </div>
                                ))}

                            </div>

                            {/* X-axis labels */}
                            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                                {[
                                    "Jan",
                                    "Feb",
                                    "Mar",
                                    "Apr",
                                    "May",
                                    "Jun",
                                    "Jul",
                                    "Aug",
                                    "Sep",
                                    "Oct",
                                    "Nov",
                                    "Dec",
                                ].map((month) => (
                                    <div
                                        key={month}
                                        className="h-3 w-5 bg-border rounded"
                                    />
                                ))}
                            </div>

                        </div>

                    </div>

                </div>
            </div>

        </div>
    )
}