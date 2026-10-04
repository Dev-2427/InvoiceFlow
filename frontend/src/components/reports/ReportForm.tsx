import { useForm } from "react-hook-form"
import type { IDateRange } from "../../types/reports.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { getReportsSchema, type GetReportsSchemaInput } from "../../validation/reportsValidation"
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2"
import SearchedClientList from "../invoice/SearchedClientList"
import { useEffect, useRef, useState } from "react"
import clientStore from "../../store/clientStore"
import toast from "react-hot-toast"
import type { InvoiceFilterType } from "../../types/invoice.types"
import InvoiceStatusOptionsMenu from "./InvoiceStatusOptionsMenu"
import { TbCalendar, TbChevronDown } from "react-icons/tb"
import DatePicker from "../ui/DatePicker"
import reportsStore from "../../store/reportsStore"
import ClientDetailsMenu from "../invoice/ClientDetailsMenu"

const dateRangeOptions: IDateRange[] = [
    {
        label: "today",
        filter: "today"
    },
    {
        label: "this week",
        filter: "this_week"
    },
    {
        label: "this month",
        filter: "this_month"
    },
    {
        label: "this year",
        filter: "this_year"
    },
    {
        label: "custom",
        filter: "custom"
    },
]

const invoiceStatus: InvoiceFilterType[] = ["all", "draft", "overdue", "paid", "unpaid"]

interface ReportFormProps {
    onSubmit: (data: GetReportsSchemaInput) => void
}

export default function ReportForm({ onSubmit }: ReportFormProps) {

    const clientSearchString = clientStore((state) => state.clientSearchString)
    const selectedClient = clientStore((state) => state.selectedClient)
    const searchClient = clientStore((state) => state.searchClient)
    const searchedClients = clientStore((state) => state.searchedClients)
    const setClientSearchString = clientStore((state) => state.setClientSearchString)
    const clearSearchedAndSelectedClient = clientStore((state) => state.clearSearchedAndSelectedClient)

    const isGettingReports = reportsStore((state) => state.isGettingReports)

    const [showStatusFilterOptions, setShowStatusFilterOptions] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState<"from" | "to" | null>(null)
    const [showClientDetails, setShowClientDetails] = useState(false)

    const invoiceStatusOptionsMenu = useRef<HTMLDivElement>(null)

    useEffect(() => {

        if (selectedClient) return

        async function fetchSearchedClients() {

            const res = await searchClient()

            if (!res.success) {
                toast.error(res.message)
                return
            }
        }

        const searchTimeout = setTimeout(() => {
            fetchSearchedClients()
        }, 300)


        return (() => {
            clearTimeout(searchTimeout)
        })
    }, [clientSearchString])

    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (!invoiceStatusOptionsMenu.current || !invoiceStatusOptionsMenu.current.contains(e.target as Node)) {
                setShowStatusFilterOptions(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [])


    const { setValue, watch, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(getReportsSchema),
        defaultValues: {
            clientId: null,
            dateRange: "today",
            from: null,
            to: null,
            status: "all"
        }
    })

    const dateRange = watch("dateRange")
    const status = watch("status")
    const from = watch("from") as Date
    const to = watch("to") as Date

    function handleClickOnDateRange(range: IDateRange) {
        if (range.filter !== "custom") {
            setValue("from", null)
            setValue("to", null)
        }
        setValue("dateRange", range.filter,)
    }

    return (
        <div className="px-5">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-card px-5 py-3 rounded-[14px] border-[1.5px] border-border space-y-5">

                <header className="text-text text-[15px] font-bold mb-5">
                    Filters
                </header>

                {/* date range */}
                <div className="flex flex-col gap-2">
                    <span className="text-xs text-text-sm font-bold">DATE RANGE</span>

                    <div className="flex items-center gap-2 flex-wrap">
                        {dateRangeOptions.map((option) => (
                            <button
                                onClick={() => handleClickOnDateRange(option)}
                                key={option.filter}
                                type="button"
                                className={`flex justify-center items-center border-[1.5px] ${option.filter === dateRange ? "text-card bg-navy-700 border-navy-700" : "text-text bg-card border-border"} text-[13px] font-semibold rounded-[14px] px-4 py-1 capitalize cursor-pointer`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>


                {/* custom date range */}
                {dateRange === "custom" &&
                    <div className="flex flex-col gap-3 bg-page border-[1.5px] border-border rounded-[14px] px-5 py-3">

                        <div className="flex items-center gap-1.5 text-xs text-text-sm font-bold">
                            <TbCalendar />
                            <span>CUSTOM DATE RANGE</span>
                        </div>


                        <div className="flex flex-col lg:flex-row items-center lg:gap-2">

                            <div className="lg:w-1/2 w-full">
                                <DatePicker
                                    isOpen={showDatePicker === "from"}
                                    label="FROM"
                                    onClose={() => setShowDatePicker(null)}
                                    onOpen={() => setShowDatePicker("from")}
                                    value={from}
                                    error={errors.dateRange?.message}
                                    onChange={(date) => {
                                        setValue("from", date, {
                                            shouldValidate: true
                                        })
                                    }}
                                />
                            </div>

                            <div className="lg:w-1/2 w-full">
                                <DatePicker
                                    isOpen={showDatePicker === "to"}
                                    label="TO"
                                    onClose={() => setShowDatePicker(null)}
                                    onOpen={() => setShowDatePicker("to")}
                                    value={to}
                                    error={errors.dateRange?.message}
                                    onChange={(date) => {
                                        setValue("to", date, {
                                            shouldValidate: true
                                        })
                                    }}
                                />
                            </div>
                        </div>

                    </div>
                }


                {/* client and status */}
                <div className="flex flex-col lg:flex-row items-center lg:gap-2 gap-5">

                    <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                        <span className="text-xs text-text-sm font-bold">CLIENT</span>

                        <div className="relative">
                            <input
                                className="bg-card pl-8 pr-3 border-[1.5px] text-sm border-border rounded-[10px] h-10 text-text-xs placeholder:text-text-xs outline-none w-full"
                                type="text"
                                value={clientSearchString}
                                onChange={(e) => setClientSearchString(e.target.value)}
                                placeholder="Search client..."
                            />
                            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-text-xs" />

                            {searchedClients &&
                                <SearchedClientList
                                    onClientSelect={(clientId) =>
                                        setValue("clientId", clientId, { shouldValidate: true })
                                    }
                                />
                            }
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 lg:w-1/2 w-full">
                        <span className="text-xs text-text-sm font-bold">STATUS</span>

                        <div
                            ref={invoiceStatusOptionsMenu}
                            className="relative">

                            <button
                                onClick={() => {
                                    setShowStatusFilterOptions((prev) => !prev)
                                }}
                                type="button"
                                className="flex items-center justify-between bg-card px-3 border-[1.5px] text-sm border-border rounded-[10px] h-10 text-text-xs placeholder:text-text-xs outline-none w-full text-left capitalize cursor-pointer"
                            >
                                {status}
                                <TbChevronDown className={`${showStatusFilterOptions && "rotate-180"}`} />
                            </button>

                            {showStatusFilterOptions &&
                                <InvoiceStatusOptionsMenu
                                    invoiceStatus={invoiceStatus}
                                    currentStatus={status}
                                    onSelectStatus={(status) => {
                                        setValue("status", status, { shouldValidate: true })
                                        setShowStatusFilterOptions(false)
                                    }
                                    }
                                />
                            }
                        </div>
                    </div>
                </div>

                {/* client details */}
                {selectedClient &&
                    < div
                        onClick={() => setShowClientDetails(true)}
                        className="flex justify-between items-center bg-navy-50 border border-text-sm rounded-[14px] px-5 py-3 cursor-pointer" >

                        <div className="flex items-center gap-2">

                            <div className="flex justify-center items-center capitalize bg-navy-700 text-card font-bold text-[16px] h-8 w-8 rounded-lg">{selectedClient.displayName.charAt(0)}</div>

                            <div>
                                <p className="text-navy-700 text-sm font-bold">{selectedClient.displayName}</p>
                                <p className={`${!selectedClient.companyName && "invisible"} text-text-sm text-[13px]`}>{selectedClient.companyName ?? "invisible"}</p>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()

                                setValue("clientId", null)
                                clearSearchedAndSelectedClient()
                                setClientSearchString("")
                            }}
                            type="button"
                            className="flex justify-center items-center bg-card text-[13px] border-[1.5px] border-border px-3 py-1.5 rounded-lg text-text-sm cursor-pointer font-semibold"
                        >
                            <HiXMark size={16} />
                            Clear
                        </button>
                    </div>

                }


                {/* fetch button */}
                <button
                    type="submit"
                    disabled={isGettingReports}
                    className="bg-navy-700 text-card text-sm font-bold rounded-[14px] w-full py-3 cursor-pointer disabled:opacity-50"
                >
                    {isGettingReports ? "Getting report..." : "Fetch Report"}
                </button>

            </form >

            {
                showClientDetails && selectedClient &&
                <ClientDetailsMenu
                    client={selectedClient}
                    onClose={() => setShowClientDetails(false)}
                />
            }
        </div >
    )

}