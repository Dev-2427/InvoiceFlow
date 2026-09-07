import type { PaymentModeType } from "../../types/invoice.types"

interface PaymentModeMenuProps {
    onChange: (mode: PaymentModeType) => void,
    onClose: () => void,
    directionBottomLeft? : boolean
}

export default function PaymentModeMenu({ onChange, onClose, directionBottomLeft }: PaymentModeMenuProps) {

    const paymentMode = ["cash", "bank_transfer", "credit_card", "debit_card", "upi", "cheque", "paypal", "other"] as const

    return (
        <div className={`absolute ${directionBottomLeft ? "lg:bottom-7 bottom-full right-0" : "bottom-full right-0"} bg-card border-[1.5px] border-border rounded-[14px] flex flex-col overflow-hidden min-w-34`}>
            {paymentMode.map((mode) => (
                <button
                    onClick={() => {
                        onChange(mode)
                        onClose()
                    }}
                    type="button"
                    key={mode}
                    className="text-start hover:bg-page w-full py-1 px-5 text-text cursor-pointer"
                >
                    {mode}
                </button>
            ))}
        </div>
    )
}
