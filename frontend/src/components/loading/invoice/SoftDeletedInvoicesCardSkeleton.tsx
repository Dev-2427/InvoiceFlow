export default function SoftDeletedInvoicesCardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between items-center gap-3 mx-5">

            {/* card  */}
            {[1, 2, 3, 4, 5, 6].map((index) => {

                return (
                    <div
                        key={index}
                        className="flex flex-col gap-2 bg-card rounded-[14px] p-4 shadow-lg animate-pulse"
                    >


                        <div className="flex justify-between items-center">

                            <div className="w-18 h-4 bg-page rounded-lg" />

                            <div className="rounded-lg w-14 h-5 bg-page" />
                        </div>

                        <div className="flex flex-col justify-between items-start gap-2">

                            <div className="flex items-center gap-2 min-w-0">

                                <div className="bg-page h-10 w-10 rounded-lg" />

                                <div className="space-y-1">
                                    <p className="h-4 w-24 rounded-lg bg-page"
                                    />
                                    <p className="h-4 w-28 rounded-lg bg-page"
                                    />

                                </div>

                            </div>


                            <div className="w-full h-14 bg-page rounded-lg" />

                            <div className="w-full h-10 bg-page rounded-lg" />


                            <div className="flex justify-between items-center w-full">

                                <div className="space-y-1">
                                    <div className="w-12 h-4 bg-page rounded-lg" />
                                    <div className="w-20 h-4 bg-page rounded-lg" />

                                </div>

                                <div className="space-y-1">
                                    <div className="w-12 h-4 bg-page rounded-lg" />
                                    <div className="w-20 h-4 bg-page rounded-lg" />

                                </div>

                            </div>


                            <hr className="border-border w-full" />

                            {/* restore and delete button */}
                            <div className="flex items-center w-full gap-3">
                                <div
                                    className="w-1/2 bg-page h-7 rounded-lg" />

                                <div
                                    className="w-1/2 bg-page h-7 rounded-lg" />


                            </div>

                        </div>

                    </div>
                )
            })}
        </div>
    )
}