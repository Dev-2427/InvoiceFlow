import { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiMagnifyingGlass } from "react-icons/hi2";
import type { IInvoiceSort, InvoiceFilterType } from "../../types/invoice.types";
import invoiceStore from "../../store/invoiceStore";

const sortProperties: IInvoiceSort[] = [
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
        label: "Due Date A-Z",
        sort: "dueDate",
        order: "asc",
    },
    {
        label: "Due Date Z-A",
        sort: "dueDate",
        order: "desc",
    },
    {
        label: "Amount (Highest)",
        sort: "amount",
        order: "desc",
    },
    {
        label: "Amount (Lowest)",
        sort: "amount",
        order: "asc",
    },
    {
        label: "Client A-Z",
        sort: "client",
        order: "asc",
    },
    {
        label: "Client Z-A",
        sort: "client",
        order: "desc",
    }
]

const filterProperties: Array<InvoiceFilterType> = ["all", "paid", "unpaid", "overdue", "draft"]

export default function InputAndFilters() {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const invoiceSort = invoiceStore((state) => state.invoiceSort)
    const invoiceFilter = invoiceStore((state) => state.invoiceFilter)
    const setInvoiceSortAndOrder = invoiceStore((state) => state.setInvoiceSortAndOrder)
    const setInvoiceFilter = invoiceStore((state) => state.setInvoiceFilter)
    const invoiceSearch = invoiceStore((state) => state.invoiceSearch)
    const setInvoiceSearch = invoiceStore((state) => state.setInvoiceSearch)

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
                        className="bg-card pl-8 pr-3 border-[1.5px] text-sm border-border rounded-[10px] h-10 text-text-xs placeholder:text-text-xs outline-none w-full"
                        type="text"
                        value={invoiceSearch}
                        onChange={(e) => setInvoiceSearch(e.target.value)}
                        placeholder="Search invoices..."
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
                        className="relative flex justify-between items-center gap-2 bg-card px-5 py-2 border-[1.5px] border-border rounded-[10px] text-sm text-text cursor-pointer min-w-44"
                    >
                        <span>{invoiceSort.label}</span>
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
                                        setInvoiceSortAndOrder(property)
                                    }
                                    }
                                    className={`w-full text-sm py-2 cursor-pointer transition-colors duration-200 ${invoiceSort.sort === property.sort && invoiceSort.order === property.order ? "bg-navy-700 text-card" : "text-text hover:bg-page"}`}
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
                {filterProperties.map((property) => {
                    return (
                        <button
                            key={property}
                            type="button"
                            onClick={() => setInvoiceFilter(property)}
                            className={`px-3 py-2 rounded-[10px] text-[12px] cursor-pointer transition-colors ${invoiceFilter === property ? "bg-navy-700 text-card" : "bg-card border-[1.5px] border-border text-text font-semibold hover:bg-navy-50"} capitalize`}
                        >
                            {property}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
