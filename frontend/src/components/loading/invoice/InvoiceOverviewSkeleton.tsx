export default function InvoiceOverviewSkeleton() {
    return (
        <main className="space-y-5">

            {/* action buttons */}
            <div className="flex flex-col gap-2 px-5 mt-5">

                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">

                    {/* back button */}
                    <div className="h-7 w-20 bg-card rounded-[10px] animate-pulse" />

                    {/* action buttons */}
                    <div className="flex items-center flex-wrap gap-2">
                        <div className="h-7 w-28 bg-card rounded-[10px] animate-pulse" />
                        <div className="h-7 w-16 bg-card rounded-[10px] animate-pulse" />
                        <div className="h-7 w-20 bg-card rounded-[10px] animate-pulse" />
                        <div className="h-7 w-16 bg-card rounded-[10px] animate-pulse" />
                        <div className="h-7 w-20 bg-card rounded-[10px] animate-pulse" />
                        <div className="h-7 w-20 bg-card rounded-[10px] animate-pulse" />
                    </div>

                </div>

                {/* logo toggle */}
                <div className="flex justify-end my-1">
                    <div className="flex items-center gap-2 max-w-full">
                        <div className="h-4 w-20 bg-border/60 rounded animate-pulse shrink-0" />
                        <div className="h-6 w-11 bg-border/60 rounded-full animate-pulse shrink-0" />
                    </div>
                </div>

            </div>

            {/* invoice */}
            <div className="px-5 pb-5">
                <div className="flex flex-col gap-5 lg:w-2xl w-full mx-auto rounded-[14px] bg-card p-6">

                    {/* organization + invoice info */}
                    <div className="flex justify-between">

                        {/* organization */}
                        <div className="grid grid-cols-1 gap-3">

                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-page animate-pulse" />
                                <div className="h-5 w-32 bg-page rounded animate-pulse" />
                            </div>

                            <div className="space-y-1">
                                <div className="h-3 w-48 bg-page rounded animate-pulse" />
                                <div className="h-3 w-56 bg-page rounded animate-pulse" />
                                <div className="h-3 w-36 bg-page rounded animate-pulse mt-1" />
                            </div>

                        </div>

                        {/* invoice number / status / dates */}
                        <div className="grid grid-cols-1 gap-3 items-end">

                            <div className="h-7 w-28 bg-page rounded animate-pulse self-end" />

                            <div className="h-6 w-16 bg-page rounded-full animate-pulse justify-self-end" />

                            <div className="space-y-1 self-end">
                                <div className="h-3 w-28 bg-page rounded animate-pulse" />
                                <div className="h-3 w-28 bg-page rounded animate-pulse" />
                            </div>

                        </div>

                    </div>

                    {/* bill to */}
                    <div className="space-y-2 bg-page rounded-lg px-5 py-3">

                        <div className="h-3 w-16 bg-card rounded animate-pulse" />
                        <div className="h-5 w-40 bg-card rounded animate-pulse" />
                        <div className="h-4 w-32 bg-card rounded animate-pulse" />

                    </div>

                    {/* line items */}
                    <div>

                        {/* header */}
                        <div className="flex justify-between items-center bg-page rounded-lg px-4 py-3">

                            <div className="h-3 w-24 bg-card rounded animate-pulse" />

                            <div className="flex gap-2">
                                <div className="h-3 w-20 bg-card rounded animate-pulse" />
                                <div className="h-3 w-20 bg-card rounded animate-pulse" />
                                <div className="h-3 w-20 bg-card rounded animate-pulse" />
                            </div>

                        </div>

                        {/* rows */}
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="flex justify-between items-center bg-page rounded-lg px-4 py-3 mt-1"
                            >
                                <div className="h-4 w-40 bg-card rounded animate-pulse" />

                                <div className="flex gap-2">
                                    <div className="h-4 w-20 bg-card rounded animate-pulse" />
                                    <div className="h-4 w-20 bg-card rounded animate-pulse" />
                                    <div className="h-4 w-20 bg-card rounded animate-pulse" />
                                </div>
                            </div>
                        ))}

                    </div>

                    {/* calculations */}
                    <div className="self-end min-w-44 space-y-2">

                        <div className="flex justify-between">
                            <div className="h-4 w-16 bg-page rounded animate-pulse" />
                            <div className="h-4 w-20 bg-page rounded animate-pulse" />
                        </div>

                        <div className="flex justify-between">
                            <div className="h-4 w-28 bg-page rounded animate-pulse" />
                            <div className="h-4 w-20 bg-page rounded animate-pulse" />
                        </div>

                        <div className="flex justify-between">
                            <div className="h-4 w-28 bg-page rounded animate-pulse" />
                            <div className="h-4 w-20 bg-page rounded animate-pulse" />
                        </div>

                        <div className="h-0.5 w-full bg-page animate-pulse" />

                        <div className="flex justify-between">
                            <div className="h-5 w-12 bg-page rounded animate-pulse" />
                            <div className="h-5 w-24 bg-page rounded animate-pulse" />
                        </div>

                    </div>

                    {/* notes */}
                    <div className="space-y-2 bg-page rounded-lg px-5 py-3">

                        <div className="h-3 w-12 bg-card rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-card rounded animate-pulse" />

                    </div>

                    {/* signature */}
                    <div className="w-42 self-end text-center space-y-2">

                        <div className="h-px bg-page mt-12 animate-pulse" />
                        <div className="h-3 w-28 bg-page rounded animate-pulse mx-auto" />
                        <div className="h-3 w-36 bg-page rounded animate-pulse mx-auto" />

                    </div>

                </div>
            </div>

        </main>
    )
}