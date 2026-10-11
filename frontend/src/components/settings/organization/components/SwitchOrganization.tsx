import { TbCheck, TbPlus } from "react-icons/tb"
import type { getAllOrganizationsResponseData, organizationData } from "../../../../types/organization.types"
import formatLocalDate from "../../../../utils/dateUtils"
import { useNavigate } from "react-router-dom"

interface SwitchOrganizationProps {
    getAllOrganizations: () => void,
    isGettingAllOrganizations: boolean,
    allOrganizations: getAllOrganizationsResponseData[] | null,
    currentOrganization: organizationData,
    switchOrganization: (organizationId: string) => void,
    switchingOrganizationId: string | null
}

export default function SwitchOrganization({ getAllOrganizations, isGettingAllOrganizations, allOrganizations, currentOrganization, switchOrganization, switchingOrganizationId }: SwitchOrganizationProps) {

    const navigate = useNavigate()

    return (
        <div className="px-5 space-y-5 max-w-2xl">

            <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-4">

                {/* header */}
                <div>
                    <span className="text-text text-[15px] font-bold">Switch Organisation</span>
                    <p className="text-[13px] text-text-sm">All organisations linked to your account</p>
                </div>

                <hr className="border border-border/70" />

                {!allOrganizations ?
                    <div className="flex flex-col justify-center items-center gap-3">
                        <p className="text-text-sm text-[13.5px] text-center">Click below to load all organisations connected to your account. You can then switch between them.</p>

                        <button
                            onClick={getAllOrganizations}
                            disabled={isGettingAllOrganizations}
                            type="button"
                            className="bg-navy-700 text-card hover:bg-navy-700/90 rounded-lg px-5 py-2.5 w-full text-[14px] font-bold cursor-pointer disabled:opacity-50 disabled:pointer-events-none">
                            {isGettingAllOrganizations ? "Loading..." : "Load My Organizations"}
                        </button>
                    </div>
                    :
                    <>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-paid" />

                            <span className="text-paid text-[13px] font-bold">Currently active: {currentOrganization?.organizationName}</span>
                        </div>

                        {/* active organization */}
                        <div
                            className="flex justify-between items-center bg-navy-50 border-[1.5px] border-navy-700 rounded-lg px-4 py-3">

                            {/* logo and details*/}
                            < div className="flex items-center gap-3" >

                                {
                                    currentOrganization.logo?.url ?
                                        <img
                                            className="h-10 w-10 object-cover rounded-lg shrink-0"
                                            src={currentOrganization.logo.url} />
                                        :

                                        <div className="flex justify-center items-center rounded-lg w-10 h-10 bg-gold text-gold-dark font-bold text-xl shrink-0">
                                            {currentOrganization.organizationName.charAt(0).toUpperCase()}
                                        </div>
                                }

                                < div className="flex flex-col justify-between min-w-0" >
                                    <span className="text-text text-sm font-bold capitalize">{currentOrganization.organizationName}</span>

                                    <div className="flex items-center gap-1">
                                        <span className="text-[13px] text-text-sm break-all">{currentOrganization.currency.code}</span>
                                        <span className="text-[13px] text-text-sm break-all">· {formatLocalDate(currentOrganization.createdAt)}</span>
                                    </div>
                                </div>

                            </div>

                            <div
                                className="flex justify-center items-center gap-1 px-3 py-1.5 border-[1.5px] rounded-lg border-border text-[13px] font-semibold text-text"
                            >
                                <TbCheck size={16} /> Active
                            </div>
                        </div>

                        {/* all organization */}
                        {allOrganizations.map((org) => {
                            if (org._id === currentOrganization._id) return null
                            return (
                                <div
                                    key={org._id}
                                    className="flex justify-between items-center bg-card border-[1.5px] border-border rounded-lg px-4 py-3">

                                    {/* logo and details*/}
                                    < div className="flex items-center gap-3" >

                                        {
                                            org.logo.url ?
                                                <img
                                                    className="h-10 w-10 object-cover rounded-lg shrink-0"
                                                    src={org.logo.url} />
                                                :

                                                <div className="flex justify-center items-center rounded-lg w-10 h-10 bg-page text-text-sm font-bold text-xl shrink-0">
                                                    {org.organizationName.charAt(0).toUpperCase()}
                                                </div>
                                        }

                                        < div className="flex flex-col justify-between min-w-0" >
                                            <span className="text-text text-sm font-bold capitalize">{org.organizationName}</span>

                                            <div className="flex items-center gap-1">
                                                <span className="text-[13px] text-text-sm break-all">{org.currency.code}</span>
                                                <span className="text-[13px] text-text-sm break-all">· {formatLocalDate(org.createdAt)}</span>
                                            </div>
                                        </div>

                                    </div>

                                    <button
                                        disabled={switchingOrganizationId !== null}
                                        onClick={() => switchOrganization(org._id)}
                                        type="button"
                                        className="flex justify-center items-center px-3 py-1.5 border-[1.5px] rounded-lg border-border text-[13px] font-semibold text-text cursor-pointer hover:bg-navy-50 disabled:opacity-50 disabled:pointer-events-none"
                                    >
                                        {switchingOrganizationId === org._id ? "Switching..." : "Switch"}
                                    </button>
                                </div>
                            )
                        }
                        )}
                    </>
                }

                <hr className="border border-border/70" />

                {/* create new organisation */}
                <div className="space-y-2">
                    <button
                        onClick={() => navigate("/create-organization")}
                        type="button"
                        className="flex justify-center items-center gap-2 text-navy-700  border-2 border-border border-dashed rounded-lg py-2.5 w-full text-[14px] font-bold cursor-pointer hover:bg-navy-50">
                        <TbPlus size={18} />   Create New Organization
                    </button>

                    <p className="text-text-sm text-xs text-center">Each organisation has its own invoices, clients and currency</p>
                </div>

            </div >

        </div >
    )
}
