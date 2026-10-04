import type { InvoiceFilterType } from "../../types/invoice.types"

interface InvoiceStatusOptionsMenuProps {
    invoiceStatus: InvoiceFilterType[],
    currentStatus: InvoiceFilterType,
    onSelectStatus: (status: InvoiceFilterType) => void
}

export default function InvoiceStatusOptionsMenu({ invoiceStatus, currentStatus, onSelectStatus }: InvoiceStatusOptionsMenuProps) {
    return (
        <div className="absolute top-full right-0 bg-card border border-border w-full rounded-[10px] mt-1 overflow-hidden z-50">
            {invoiceStatus.map((status) => (
                <button
                    key={status}
                    onClick={() => onSelectStatus(status)}
                    type="button"
                    className={`text-sm px-5 py-1.5  w-full cursor-pointer capitalize text-left ${status === currentStatus ? "bg-navy-700 text-card" : "hover:bg-page bg-card text-text"}`}
                >
                    {status}
                </button>
            ))}
        </div>
    )
}
