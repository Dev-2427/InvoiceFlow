import clientStore from "../../store/clientStore"
import { HiEnvelope, HiPhone } from "react-icons/hi2";
import { TbCheck, TbArrowLeft, TbArrowRight } from "react-icons/tb";
import ClientsCardSkeleton from "../loading/client/ClientsCardSkeleton";
import { NavLink } from "react-router-dom";
import organizationStore from "../../store/organizationStore";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ClientsList() {

    const isGettingClients = clientStore((state) => state.isGettingClients)
    const getClients = clientStore((state) => state.getClients)
    const clientsData = clientStore((state) => state.clients)

    const changeSelectedClientsIds = clientStore((state) => state.changeSelectedClientsIds)
    const isPerformingAction = clientStore((state) => state.isPerformingAction)
    const selectedClientIds = clientStore((state) => state.selectedClientIds)
    const emptySelectedClientsIds = clientStore((state) => state.emptySelectedClientsIds)

    const organization = organizationStore((state) => state.organization)

    if (isGettingClients) {
        return <ClientsCardSkeleton />
    }

    if (!isGettingClients && clientsData?.clients.length === 0) {
        return (
            <div className="px-5">
                <div className="flex min-h-48 w-full items-center justify-center rounded-[14px] border-[1.5px] border-border bg-card">
                    <p className="text-sm text-text-sm">
                        No clients found.
                    </p>
                </div>
            </div>
        )
    }

    const page = clientsData?.pagination.page || 1
    const totalPages = clientsData?.pagination.totalPages || 1

    function changePage(newPage: number) {
        emptySelectedClientsIds()
        getClients(newPage)
    }

    return (
        <div className="px-5 pb-3">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between items-center gap-3">

                {/* card  */}
                {clientsData?.clients.map((client) => (
                    <NavLink
                        to={`/clients/${client._id}`}
                        key={client._id}
                        className={`flex flex-col gap-1 bg-card border-[1.5px] border-border rounded-[14px] p-4 cursor-pointer shadow-lg ${selectedClientIds.includes(client._id) && "border-navy-700"}`}
                    >


                        <div className="flex justify-between items-start gap-2">

                            <div className="flex items-center gap-2 min-w-0">

                                <div className="shrink-0 flex justify-center items-center bg-navy-700 text-card h-10 w-10 rounded-lg text-lg font-bold">
                                    {client.displayName.charAt(0).toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate font-bold text-text capitalize">{client.displayName}</p>
                                    <p className={`truncate text-text-sm text-[13px] ${!client.companyName && "invisible"}`}>{client.companyName || "invisible"}</p>
                                </div>

                            </div>

                            {/* checkbox */}
                            <div
                                onClick={(e) => {

                                    if (isPerformingAction) return

                                    e.preventDefault()
                                    e.stopPropagation()
                                    changeSelectedClientsIds(client._id)
                                }
                                }
                                className={`shrink-0 flex justify-center items-center w-3.5 h-3.5 border-[1.5px] border-text-sm rounded-sm ${isPerformingAction ? "opacity-50 cursor-default" : "cursor-pointer"}  ${selectedClientIds.includes(client._id) && "bg-navy-700 text-card border-none"}`}>

                                {selectedClientIds.includes(client._id) &&
                                    <TbCheck />
                                }
                            </div>

                        </div>


                        <div className="text-start text-text-sm text-[13px] space-y-1">

                            <p className="flex items-center gap-1">
                                {client.email ?
                                    (

                                        <>
                                            <HiEnvelope className="shrink-0" />
                                            <span className="truncate">{client.email}</span>
                                        </>
                                    )
                                    :
                                    (
                                        <span className="invisible">invisible</span>
                                    )
                                }
                            </p>

                            <p className="flex items-center gap-1">
                                {client.phone ?
                                    (
                                        <>
                                            <HiPhone className="shrink-0" />
                                            <span>{client.phone}</span>
                                        </>
                                    )
                                    :
                                    (
                                        <span className="truncate invisible">invisible</span>
                                    )
                                }
                            </p>

                        </div>


                        <hr className="border-border my-1" />


                        <div className="flex justify-between items-center">
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-text-xs font-semibold">RECEIVABLE</span>
                                <span className="text-unpaid">{organization?.currency.symbol}{formatCurrency(client.totalReceivable)}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-text-xs font-semibold">TOTAL BILLED</span>
                                <span className="text-paid">{organization?.currency.symbol}{formatCurrency(client.totalBilled)}</span>
                            </div>

                        </div>


                    </NavLink>
                ))}

            </div>

            {/* pagination  */}
            <div className="flex justify-end items-center gap-5 bg-card w-full border-[1.5px] border-border rounded-[14px] p-4 my-3">

                <p className="text-sm text-text-sm">Page {clientsData?.pagination.page} of {clientsData?.pagination.totalPages}</p>

                <div className="flex items-center gap-2">

                    <button
                        onClick={() => changePage(page - 1)}
                        type="button"
                        disabled={page === 1}
                        className="flex justify-center items-center border-[1.8px] border-border rounded-xl h-8 w-8 cursor-pointer text-sm text-text disabled:opacity-50 disabled:cursor-auto">
                        <TbArrowLeft />
                    </button>

                    {page > 1 &&
                        <button
                            onClick={() => changePage(page - 1)}
                            type="button"
                            className="flex justify-center items-center border-[1.5px] border-border rounded-xl h-8 w-8 text-text-text cursor-pointer bg-card text-text">
                            {page - 1}
                        </button>
                    }

                    <div
                        className={`flex justify-center items-center border-[1.8px] border-border rounded-xl h-8 w-8 text-text-text cursor-pointer bg-navy-700 text-sm text-card `}>
                        {page}
                    </div>

                    {page < totalPages &&
                        <button
                            onClick={() => changePage(page + 1)}
                            type="button"
                            className="flex justify-center items-center border-[1.8px] border-border rounded-xl h-8 w-8 cursor-pointer text-sm text-text">
                            {page + 1}
                        </button>
                    }

                    <button
                        onClick={() => changePage(page + 1)}
                        type="button"
                        disabled={page === totalPages}
                        className="flex justify-center items-center border-[1.8px] border-border rounded-xl h-8 w-8 cursor-pointer text-sm text-text disabled:opacity-50 disabled:cursor-auto">
                        <TbArrowRight />
                    </button>

                </div>
            </div>


        </div >
    )
}
