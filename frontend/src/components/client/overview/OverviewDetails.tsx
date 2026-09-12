import { TbChevronDown } from "react-icons/tb"
import useClientOverviewData from "../../../hooks/useClientOverviewData"
import clientStore from "../../../store/clientStore"
import organizationStore from "../../../store/organizationStore"
import formatLocalDate from "../../../utils/dateUtils"
import { useEffect, useRef, useState } from "react"
import RevenueChartFilterMenu from "./RevenueChartFilterMenu"
import RevenueChart from "./RevenueChart"
import { formatCurrency } from "../../../utils/formatCurrency"

export default function OverviewDetails() {

    const clientOverviewData = useClientOverviewData()
    const revenueChartFilter = clientStore((state) => state.revenueChartFilter)
    const setRevenueChartFilter = clientStore((state) => state.setRevenueChartFilter)
    const revenueData = clientStore((state) => state.revenueData)

    const organization = organizationStore((state) => state.organization)

    const [showRevenueChartFilterMenu, setShowRevenueChartFilterMenu] = useState(false)

    const revenueChartFilterMenuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (revenueChartFilterMenuRef.current && !revenueChartFilterMenuRef.current.contains(e.target as Node)) {
                setShowRevenueChartFilterMenu(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)

        return (() => {
            document.removeEventListener("mousedown", handleOutsideClick)
        })

    }, [])

    const totalRevenue = revenueData?.reduce((total, next) => {
        return total + next.revenue
    }, 0) ?? 0

    return (
        <div className="px-5 space-y-5 mb-5">

            <div className="flex items-center gap-3">

                <div className="flex justify-center items-center w-12 h-12 rounded-[14px] bg-navy-700 text-card text-[22px] font-bold">
                    {clientOverviewData.firstName?.charAt(0).toUpperCase()}
                </div>

                <div>
                    <span className="font-bold text-lg text-text">{clientOverviewData.salutation} {clientOverviewData.firstName} {clientOverviewData.lastName}</span>

                    <div className="flex items-center gap-2 text-[13px]">
                        <span className={`text-text-sm ${!clientOverviewData.companyName && "invisible"}}`}>{clientOverviewData.companyName || "Invisible"}</span>
                        <span className={`${clientOverviewData.status === "active" ? "text-paid" : "text-overdue"} capitalize`}>· {clientOverviewData.status}</span>
                    </div>
                </div>

            </div>


            <div className="grid md:grid-cols-2 lg:grid-cols-3 items-start gap-3">


                {/* contact info */}
                <div className="bg-card border border-border rounded-[14px] space-y-1.5 py-3 px-5 h-full">

                    <p className="font-bold text-sm text-text mb-3">Contact Info</p>

                    <div className="flex justify-between items-center gap-2 text-[13px]">
                        <span className="text-text-sm shrink-0">Email</span>
                        <span className="text-text font-semibold truncate">{clientOverviewData.email || "—"} </span>
                    </div>

                    <hr className="border border-border/40" />

                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-text-sm">Phone</span>
                        <span className="text-text font-semibold">{clientOverviewData.phone || "—"}</span>
                    </div>

                    <hr className="border border-border/40" />

                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-text-sm">Currency</span>
                        <span className="text-text font-semibold">{organization?.currency.code}</span>
                    </div>

                    <hr className="border border-border/40" />

                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-text-sm">Type</span>
                        <span className="text-text font-semibold capitalize">{clientOverviewData.clientType}</span>
                    </div>

                    <hr className="border border-border/40" />

                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-text-sm">Created</span>
                        <span className="text-text font-semibold capitalize">{formatLocalDate(clientOverviewData.createdAt)}</span>
                    </div>

                    <hr className="border border-border/40" />

                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-text-sm">Updated</span>
                        <span className="text-text font-semibold capitalize">{formatLocalDate(clientOverviewData.updatedAt)}</span>
                    </div>

                </div>


                {/* billing address */}
                <div className="bg-card border border-border rounded-[14px] space-y-1.5 py-3 px-5 h-full">

                    <p className="font-bold text-sm text-text mb-3">Billing Address</p>

                    <p className="text-[13px] text-text-sm">{clientOverviewData.billingAddress?.street1}</p>

                    <p className="text-[13px] text-text-sm">{clientOverviewData.billingAddress?.street2}</p>

                    <div className="text-[13px] text-text-sm">
                        <span>{clientOverviewData?.billingAddress?.city}  {clientOverviewData.billingAddress?.state} {clientOverviewData.billingAddress?.pincode}</span>
                    </div>

                    <p className="text-[13px] text-text-sm">{clientOverviewData.billingAddress?.country}</p>

                </div>


                {/* shipping address */}
                <div className="bg-card border border-border rounded-[14px] space-y-1.5 py-3 px-5 h-full">

                    <p className="font-bold text-sm text-text mb-3">Shipping Address</p>

                    <p className="text-[13px] text-text-sm">{clientOverviewData.shippingAddress?.street1}</p>

                    <p className="text-[13px] text-text-sm">{clientOverviewData.shippingAddress?.street2}</p>

                    <div className="text-[13px] text-text-sm">
                        <span>{clientOverviewData?.shippingAddress?.city}  {clientOverviewData.shippingAddress?.state} {clientOverviewData.shippingAddress?.pincode}</span>
                    </div>

                    <p className="text-[13px] text-text-sm">{clientOverviewData.shippingAddress?.country}</p>

                </div>



            </div>
            {/* revenue chart */}
            {revenueData &&
                <div className="bg-card border border-border rounded-[14px] space-y-1.5 py-3 px-5 h-full w-full">

                    <div className="flex justify-between">
                        <p className="font-bold text-sm text-text mb-3">Revenue Chart</p>


                        <div
                            ref={revenueChartFilterMenuRef}
                            className="relative">
                            <button
                                onClick={() => setShowRevenueChartFilterMenu(prev => !prev)}
                                className="flex justify-center items-center gap-2 border border-border rounded-[10px] text-[12px] font-semibold text-text px-3 py-1.5 cursor-pointer capitalize">
                                {revenueChartFilter.label}
                                <TbChevronDown className={`${showRevenueChartFilterMenu && "rotate-180"}`} />
                            </button>

                            {showRevenueChartFilterMenu && <RevenueChartFilterMenu
                                onClick={(filter) => {
                                    setRevenueChartFilter(filter)
                                    setShowRevenueChartFilterMenu(false)
                                }}
                            />}
                        </div>


                    </div>

                    <RevenueChart
                        revenueData={revenueData}
                        currencySymbol={organization?.currency.symbol ?? ""}
                    />

                    <span className="text-navy-700 text-sm font-bold">
                        Total: {organization?.currency.symbol}{formatCurrency(totalRevenue)}
                    </span>

                </div>
            }

        </div>
    )
}
