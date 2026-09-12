export default function RevenueChartSkeleton() {
    return (
        <div className="bg-card border border-border rounded-[14px] space-y-1.5 py-3 px-5 h-full w-full animate-pulse">

            <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-border/50 rounded" />
                <div className="h-7 w-28 bg-border/50 rounded-[10px]" />
            </div>

            <div className="w-full h-52">
                <svg
                    viewBox="0 0 600 220"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                >
                    {/* grid */}
                    <line
                        x1="45"
                        y1="30"
                        x2="590"
                        y2="30"
                        stroke="currentColor"
                        strokeOpacity="0.08"
                    />
                    <line
                        x1="45"
                        y1="80"
                        x2="590"
                        y2="80"
                        stroke="currentColor"
                        strokeOpacity="0.08"
                    />
                    <line
                        x1="45"
                        y1="130"
                        x2="590"
                        y2="130"
                        stroke="currentColor"
                        strokeOpacity="0.08"
                    />
                    <line
                        x1="45"
                        y1="180"
                        x2="590"
                        y2="180"
                        stroke="currentColor"
                        strokeOpacity="0.08"
                    />

                    {/* fake line */}
                    <path
                        d="M50 165 C100 150, 120 175, 165 145 S230 110, 275 135 S340 155, 380 105 S445 80, 485 115 S540 90, 585 65"
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity="0.12"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />

                    {/* fake points */}
                    {[
                        [50, 165],
                        [105, 150],
                        [165, 145],
                        [220, 110],
                        [275, 135],
                        [330, 155],
                        [380, 105],
                        [435, 80],
                        [485, 115],
                        [535, 90],
                        [585, 65],
                    ].map(([cx, cy], index) => (
                        <circle
                            key={index}
                            cx={cx}
                            cy={cy}
                            r="5"
                            fill="currentColor"
                            fillOpacity="0.12"
                        />
                    ))}
                </svg>
            </div>

            <div className="h-4 w-32 bg-border/50 rounded" />

        </div>
    )
}