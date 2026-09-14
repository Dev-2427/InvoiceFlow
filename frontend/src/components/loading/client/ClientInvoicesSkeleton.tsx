export default function ClientInvoicesSkeleton() {
    return (
        <div className="mt-7 animate-pulse">

            {/* invoice header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-0.75 h-4 bg-border rounded-lg" />
                <div className="w-20 h-4 bg-border rounded" />
            </div>

            {/* table */}
            <div className="bg-page border border-border rounded-t-[14px] overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full min-w-150">

                        {/* table headers */}
                        <thead>
                            <tr className="border-b border-border">
                                <th className="px-5 py-3 text-left">
                                    <div className="h-3 w-16 bg-border rounded" />
                                </th>

                                <th className="px-5 py-3 text-left">
                                    <div className="h-3 w-12 bg-border rounded" />
                                </th>

                                <th className="px-5 py-3 text-left">
                                    <div className="h-3 w-16 bg-border rounded" />
                                </th>

                                <th className="px-5 py-3 text-left">
                                    <div className="h-3 w-14 bg-border rounded" />
                                </th>
                            </tr>
                        </thead>

                        {/* table rows */}
                        <tbody>
                            {Array.from({ length: 7 }).map((_, index) => (
                                <tr
                                    key={index}
                                    className="bg-card border-b border-border last:border-b-0"
                                >
                                    <td className="px-5 py-3">
                                        <div className="h-4 w-20 bg-border rounded" />
                                    </td>

                                    <td className="px-5 py-3">
                                        <div className="h-4 w-24 bg-border rounded" />
                                    </td>

                                    <td className="px-5 py-3">
                                        <div className="h-4 w-20 bg-border rounded" />
                                    </td>

                                    <td className="px-5 py-3">
                                        <div className="h-6 w-20 bg-border rounded-[14px]" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>

            </div>

            {/* pagination */}
            <div className="flex justify-end items-center gap-5 bg-card w-full border border-t-0 border-border rounded-b-[14px] p-4">

                <div className="h-4 w-20 bg-border rounded" />

                <div className="flex items-center gap-2">

                    <div className="h-8 w-8 bg-border rounded-xl" />
                    <div className="h-8 w-8 bg-border rounded-xl" />
                    <div className="h-8 w-8 bg-border rounded-xl" />
                    <div className="h-8 w-8 bg-border rounded-xl" />

                </div>

            </div>

        </div>
    )
}