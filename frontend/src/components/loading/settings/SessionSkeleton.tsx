export default function SessionsSkeleton() {
    return (
        <div className="flex flex-col gap-2 animate-pulse">
            {/* Sign out all button skeleton */}
            <div className="flex justify-end">
                <div className="h-8 w-48 rounded-lg bg-border/70" />
            </div>

            {/* Session card skeletons */}
            {Array.from({ length: 3 }).map((_, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center gap-4 px-5 py-3 border-[1.5px] border-border rounded-lg"
                >
                    {/* Device details */}
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="h-4 w-36 max-w-full rounded bg-border/70" />

                            {index === 0 && (
                                <div className="h-6 w-24 rounded-full bg-border/70" />
                            )}
                        </div>

                        {/* Last active */}
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-16 rounded bg-border/70" />
                            <div className="h-3 w-20 rounded bg-border/70" />
                        </div>
                    </div>

                    {/* Sign out button */}
                    <div className="h-8 w-20 shrink-0 rounded-lg bg-border/70" />
                </div>
            ))}

            {/* Session count and refresh */}
            <div className="flex justify-between items-center pt-1">
                <div className="h-4 w-20 rounded bg-border/70" />
                <div className="h-4 w-16 rounded bg-border/70" />
            </div>
        </div>
    )
}