import useClientOverviewData from "../../../hooks/useClientOverviewData"
import useOrganization from "../../../hooks/useOrganization"

export default function OverviewDetails() {

    const clientOverviewData = useClientOverviewData()
    const organization = useOrganization()

    return (
        <div className="px-5 space-y-5">

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
                        <span className="text-text font-semibold">{organization.currency.code}</span>
                    </div>

                    <hr className="border border-border/40" />

                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-text-sm">Type</span>
                        <span className="text-text font-semibold capitalize">{clientOverviewData.clientType}</span>
                    </div>

                    <hr className="border border-border/40" />

                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-text-sm">Created</span>
                        <span className="text-text font-semibold capitalize">{clientOverviewData.createdAt}</span>
                    </div>

                    <hr className="border border-border/40" />

                    <div className="flex justify-between items-center text-[13px]">
                        <span className="text-text-sm">Updated</span>
                        <span className="text-text font-semibold capitalize">{clientOverviewData.updatedAt || "—"}</span>
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

        </div>
    )
}
