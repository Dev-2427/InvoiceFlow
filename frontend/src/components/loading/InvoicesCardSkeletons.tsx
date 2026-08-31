
export default function InvoicesCardSkeletons() {
    return (
        <div className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                    key={index}
                    className=" rounded-[14px] border-[1.5px] border-border bg-card p-4 animate-pulse"
                >

                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-page rounded-sm" />

                            <div className="w-16 h-4 bg-page rounded-sm" />
                        </div>

                        <div className="w-18 h-4 bg-page rounded-sm" />
                    </div>

                    <div className="flex items-start gap-3 my-3">
                        <div className="h-10 w-10 rounded-lg bg-page" />

                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-32 rounded bg-page" />
                            <div className="h-3 w-24 rounded bg-page" />
                        </div>

                    </div>

                    <div className="w-full h-13 bg-page rounded-lg my-3" />

                    <div className="flex justify-between items-center w-full">
                        <div className="mt-2 space-y-2">
                            <div className="h-4 w-14 rounded bg-page" />

                            <div className="h-3 w-20 rounded bg-page" />

                        </div>
                        <div className="mt-2 space-y-2">
                            <div className="h-4 w-14 rounded bg-page" />

                            <div className="h-3 w-20 rounded bg-page" />
                        </div>
                    </div>

                    <hr className="my-3 border-border" />


                    <div className="flex justify-end">
                        <div className="w-16 h-6 bg-page rounded-lg" />
                    </div>
                    
                </div>
            ))}
        </div>
    )
}
