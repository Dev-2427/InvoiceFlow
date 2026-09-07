export default function ClientOverviewSkeleton() {

    return (
        <div className="px-5 lg:mt-5 space-y-5 animate-pulse">

          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 md:gap-0">
                <div className="w-16 h-9 bg-card rounded-[10px]" />

                <div className="flex gap-2">
                    <div className="w-16 h-9 bg-card rounded-[10px]" />
                    <div className="w-20 h-9 bg-card rounded-[10px]" />
                    <div className="w-16 h-9 bg-card rounded-[10px]" />
                    <div className="w-16 h-9 bg-card rounded-[10px]" />
                </div>
            </div>

            <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-[14px] bg-card " />

                <div className="flex flex-col gap-3">
                    <div className="w-40 h-4 bg-card rounded-[14px]" />
                    <div className="w-28 h-3 bg-card rounded-[14px]" />
                </div>

            </div>


            <div className="grid md:grid-cols-2 lg:grid-cols-3 items-start gap-3">

                <div className="bg-card border border-border rounded-[14px] space-y-1.5 py-3 px-5 h-58" />

                <div className="bg-card border border-border rounded-[14px] space-y-1.5 py-3 px-5 h-58" />

                <div className="bg-card border border-border rounded-[14px] space-y-1.5 py-3 px-5 h-58" />

            </div>

        </div>
    )
}
