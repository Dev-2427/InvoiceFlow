import { TbXFilled } from "react-icons/tb"
import type { searchClients } from "../../types/clientTypes"
import organizationStore from "../../store/organizationStore"
import { formatCurrency } from "../../utils/formatCurrency"

interface ClientDetailsMenuProps {
    client: searchClients,
    onClose: () => void
}

export default function ClientDetailsMenu({ client, onClose }: ClientDetailsMenuProps) {

    const organization = organizationStore((state) => state.organization)

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center backdrop-blur-xs px-5">

            <div className="bg-card rounded-[14px] w-md">

                <div className="flex justify-between items-start px-6 py-4">
                    <span className="font-bold text-[15px] text-text">{client.salutation ?? ""} {client.displayName}</span>

                    <TbXFilled
                        onClick={onClose}
                        className="text-text-sm cursor-pointer"
                        size={22}
                    />
                </div>

                <hr className="border border-border w-full" />


                <div className="flex flex-col gap-4 px-6 py-5">

                    <div className="flex items-center gap-2">

                        <div className="flex justify-between items-center w-1/2">
                            <div className="flex flex-col">
                                <span className="text-[11px] text-text-sm">Type</span>
                                <span className="text-text font-semibold text-[13px] capitalize">{client.clientType}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center w-1/2 min-w-0">
                            <div className="flex flex-col min-w-0 truncate">
                                <span className="text-[11px] text-text-sm">Company</span>
                                <span className="text-text font-semibold text-[13px] capitalize truncate">{client.companyName || "_"}</span>
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center gap-2">

                        <div className="flex justify-between items-center w-1/2 min-w-0">
                            <div className="flex flex-col truncate">
                                <span className="text-[11px] text-text-sm">Email</span>
                                <span className="text-text font-semibold text-[13px] truncate">{client.email || "_"}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center w-1/2">
                            <div className="flex flex-col">
                                <span className="text-[11px] text-text-sm">Phone</span>
                                <span className="text-text font-semibold text-[13px]">{client.phone || "_"}</span>
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center gap-2">

                        <div className="flex justify-between items-center w-1/2">
                            <div className="flex flex-col">
                                <span className="text-[11px] text-text-sm">Currency</span>
                                <span className="text-text font-semibold text-[13px] ">{organization?.currency.code}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center w-1/2">
                            <div className="flex flex-col">
                                <span className="text-[11px] text-text-sm">Status</span>
                                <span className="text-text font-semibold text-[13px] capitalize">{client.status}</span>
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center gap-2">

                        <div className="flex justify-between items-center w-1/2">
                            <div className="flex flex-col">
                                <span className="text-[11px] text-text-sm">City</span>
                                <span className="text-text font-semibold text-[13px] capitalize">{client.city || "_"}</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center w-1/2">
                            <div className="flex flex-col">
                                <span className="text-[11px] text-text-sm">Receivable</span>
                                <span className="text-text font-semibold text-[13px]">{organization?.currency.symbol}{formatCurrency(client.receivable)}</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>
    )
}