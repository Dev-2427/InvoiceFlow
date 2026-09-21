import formatLocalDate from "../../utils/dateUtils";
import { formatCurrency } from "../../utils/formatCurrency";

interface OverviewProps {
    clientOverviewData: {
        totalClients: number,
        totalClientsCreatedINCurrentMonth: number,
        totalOverdue: number,
        totalOverdueCount: number,
        totalReceivable: number,
        unpaidInvoicesCount: number,
        upcomingOverdue: {
            _id: string,
            client: {
                _id: string,
                displayName: string
            },
            totalAmount: number,
            dueDate: string,
        } | null
    },
    currencySymbol: string
}

export default function Overview({ clientOverviewData, currencySymbol }: OverviewProps) {

    const upcomingOverdue = clientOverviewData.upcomingOverdue

    return (
        <div className="px-5 space-y-5">

            {/* overview header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-0.75 h-4 bg-navy-700 rounded-lg" />
                <span className="text-text-sm font-bold text-[13px]">OVERVIEW</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-3">

                <div className="space-y-3 bg-card border-[1.5px] border-border rounded-[14px] px-5 py-4">
                    <p className="text-text-sm font-bold text-[12px]">TOTAL RECEIVABLE</p>

                    <div className="space-y-1">
                        <p className="text-unpaid font-bold text-xl">{currencySymbol}{formatCurrency(clientOverviewData.totalReceivable)}</p>
                        <p className="text-text-sm text-xs">{clientOverviewData.unpaidInvoicesCount} unpaid invoices</p>
                    </div>
                </div>

                <div className="space-y-3 bg-overdue-bg border-[1.5px] border-overdue-border rounded-[14px] px-5 py-4">
                    <p className="text-overdue font-bold text-[12px]">TOTAL OVERDUE</p>

                    <div className="space-y-1">
                        <p className="text-overdue font-bold text-xl">{currencySymbol}{formatCurrency(clientOverviewData.totalOverdue)}</p>
                        <p className="text-overdue text-xs">{clientOverviewData.totalOverdueCount} overdue invoices</p>
                    </div>
                </div>

                <div className="space-y-3 bg-unpaid-bg border-[1.5px] border-unpaid-border rounded-[14px] px-5 py-4">
                    <p className="text-unpaid font-bold text-[12px]">UPCOMING DUE</p>

                    <div className="space-y-1">
                        <p className="text-unpaid font-bold text-xl">{currencySymbol}{formatCurrency(upcomingOverdue?.totalAmount ?? 0)}</p>
                        <p className={`${!clientOverviewData.upcomingOverdue && "invisible"} text-unpaid text-xs`}>
                            {upcomingOverdue ?
                                `${upcomingOverdue.client.displayName} · ${formatLocalDate(upcomingOverdue.dueDate)}` : "invisible"
                            }
                        </p>
                    </div>
                </div>

                <div className="space-y-3 bg-card border-[1.5px] border-border rounded-[14px] px-5 py-4">
                    <p className="text-text-sm font-bold text-[12px]">TOTAL CLIENTS</p>

                    <div className="space-y-1">
                        <p className="text-navy-700 font-bold text-xl">{clientOverviewData.totalClients}</p>
                        <p className="text-paid text-xs">+{clientOverviewData.totalClientsCreatedINCurrentMonth} this month</p>
                    </div>
                </div>

            </div>

        </div>
    )
}
