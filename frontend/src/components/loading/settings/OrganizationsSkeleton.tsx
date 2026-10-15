export default function OrganizationsSkeleton() {
    return (
        <div className="flex flex-col gap-3 animate-pulse">
            {/* Currently active label */}
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-border" />
                <div className="h-4 w-56 max-w-full rounded bg-border/70" />
            </div>

            {/* Active organization */}
            <div className="flex justify-between items-center gap-3 bg-navy-50 border-[1.5px] border-navy-700 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-border/70" />

                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <div className="h-4 w-36 max-w-full rounded bg-border/70" />
                        <div className="h-3 w-32 max-w-full rounded bg-border/70" />
                    </div>
                </div>

                <div className="h-8 w-20 shrink-0 rounded-lg bg-border/70" />
            </div>

            {/* Other organizations */}
            {Array.from({ length: 2 }).map((_, index) => (
                <div
                    key={index}
                    className="flex justify-between items-center gap-3 bg-card border-[1.5px] border-border rounded-lg px-4 py-3"
                >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-border/70" />

                        <div className="flex flex-col gap-2 min-w-0 flex-1">
                            <div className="h-4 w-36 max-w-full rounded bg-border/70" />
                            <div className="h-3 w-32 max-w-full rounded bg-border/70" />
                        </div>
                    </div>

                    <div className="h-8 w-20 shrink-0 rounded-lg bg-border/70" />
                </div>
            ))}
        </div>
    )
}