import { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiMagnifyingGlass } from "react-icons/hi2";
import clientStore from "../../store/clientStore";
import type { ClientFilterType, IClientSort } from "../../types/clientTypes";

const sortProperties: IClientSort[] = [
    {
        label: "Created (Newest)",
        sort: "createdAt",
        order: "desc",
    },
    {
        label: "Created (Oldest)",
        sort: "createdAt",
        order: "asc",
    },
    {
        label: "Name A-Z",
        sort: "displayName",
        order: "asc",
    },
    {
        label: "Name Z-A",
        sort: "displayName",
        order: "desc",
    },
    {
        label: "Company A-Z",
        sort: "companyName",
        order: "asc",
    },
    {
        label: "Company Z-A",
        sort: "companyName",
        order: "desc",
    },
]

const filterProperties: Array<ClientFilterType> = [
    "All",
    "Business",
    "Individual",
    "Active",
    "Inactive",
    "Overdue"
]

export default function InputAndFilters() {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const clientSort = clientStore((state) => state.clientSort)
    const clientFilter = clientStore((state) => state.clientFilter)
    const setClientSortAndOrder = clientStore((state) => state.setClientSortAndOrder)
    const setClientFilter = clientStore((state) => state.setClientFilter)
    const clientSearch = clientStore((state) => state.clientSearch)
    const setClientSearch = clientStore((state) => state.setClientSearch)

    const drawerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                setIsDrawerOpen(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [])


    return (
        <div className="space-y-4 px-5">

            <div className="flex flex-wrap gap-2">

                {/* search input */}
                <div className="relative grow">
                    <input
                        className="bg-card pl-8 pr-3 border-[1.5px] text-sm border-border rounded-lg h-10 text-text-xs placeholder:text-text-xs outline-none w-full"
                        type="text"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        placeholder="Search clients..."
                    />
                    <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-text-xs" />
                </div>

                {/* sort  */}
                <div
                    ref={drawerRef}
                    className="relative">

                    <button
                        onClick={() => setIsDrawerOpen(prev => !prev)}
                        type="button"
                        className="relative flex justify-between items-center gap-2 bg-card px-5 py-2 border-[1.5px] border-border rounded-lg text-sm text-text cursor-pointer min-w-44"
                    >
                        <span>{clientSort.label}</span>
                        <HiChevronDown className={`transition-transform duration-200 ${isDrawerOpen && "rotate-180"}`} />
                    </button>

                    {isDrawerOpen &&
                        <div className="absolute right-0 overflow-hidden border border-border rounded-lg mt-1 min-w-44 bg-card shadow-lg z-50">
                            {sortProperties.map((property) => (
                                <button
                                    key={property.label}
                                    type="button"
                                    onClick={() => {
                                        setIsDrawerOpen(false)
                                        setClientSortAndOrder(property)
                                    }
                                    }
                                    className={`w-full text-sm py-2 cursor-pointer transition-colors duration-200 ${clientSort.sort === property.sort && clientSort.order === property.order ? "bg-navy-700 text-card" : "text-text hover:bg-page"}`}
                                >
                                    {property.label}
                                </button>
                            ))}

                        </div>
                    }
                </div>

            </div>

            {/* filters  */}
            <div className="flex flex-wrap gap-2">
                {filterProperties.map((property) => (
                    <button
                        key={property}
                        type="button"
                        onClick={() => setClientFilter(property)}
                        className={`px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${clientFilter === property ? "bg-navy-700 text-card" : "bg-card border-[1.5px] border-border text-text"}`}
                    >
                        {property}
                    </button>
                ))}
            </div>
        </div>
    )
}
