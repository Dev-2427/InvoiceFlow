export default function ClientsCardSkeleton() {
    return (
        <div className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                    key={index}
                    className="rounded-[14px] border-[1.5px] border-border bg-card p-4 animate-pulse"
                >


                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-page" />

                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 rounded bg-page" />
                            <div className="h-3 w-24 rounded bg-page" />
                        </div>

                        <div className="h-3.5 w-3.5 rounded-sm bg-page" />
                    </div>


                    <div className="mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-page" />
                            <div className="h-3 w-44 rounded bg-page" />
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded bg-page" />
                            <div className="h-3 w-28 rounded bg-page" />
                        </div>
                    </div>

                    <hr className="my-3 border-border" />


                    <div className="flex justify-between">
                        <div className="space-y-2">
                            <div className="h-2 w-20 rounded bg-page" />
                            <div className="h-4 w-16 rounded bg-page" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-2 w-20 rounded bg-page" />
                            <div className="h-4 w-16 rounded bg-page" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}