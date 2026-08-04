export default function OrganizationSkeleton() {
    return (
        <div className="flex items-center justify-between rounded-lg border border-border/10 bg-navy-700 p-3 animate-pulse">

            <div className="flex items-center gap-2 min-w-0">

                <div className="h-8 w-8 rounded-lg bg-card/20 shrink-0" />

                <div className="min-w-0 space-y-2">
                    <div className="h-4 w-32 rounded bg-card/20" />
                    <div className="h-3 w-12 rounded bg-card/20" />
                </div>

            </div>

            <div className="h-5 w-5 rounded-full bg-card/20 shrink-0" />

        </div>
    )
}