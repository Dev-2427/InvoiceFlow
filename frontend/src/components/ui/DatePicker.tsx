import { TbCalendar } from "react-icons/tb"
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css"

interface DatePickerProps {
    value: Date | undefined,
    onChange: (date: Date | undefined) => void,
    label: string,
    error?: string,
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
    directionUpLeft?: boolean,
    directionCenterLeft?: boolean
}

export default function DatePicker({ label, onChange, value, error, isOpen, onClose, onOpen, directionUpLeft,directionCenterLeft }: DatePickerProps) {

    const today = new Date()

    return (
        <div className="relative flex flex-col gap-1 w-full">
            <label className="text-[11px] text-text-sm font-bold">
                {label}
            </label>

            <button
                type="button"
                onClick={() => isOpen ? onClose() : onOpen()}
                className="flex justify-between items-center w-full border-[1.5px] border-border rounded-lg py-2.5 px-3 text-[14px] text-text cursor-pointer hover:bg-page"
            >
                <span>
                    {value ?
                        value.toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        })
                        :
                        "select date"
                    }
                </span>

                <TbCalendar size={18} />
            </button>

            <p className="min-h-5 text-xs text-overdue">
                {error ?? ""}
            </p>


            {isOpen && (
                <div className={`absolute z-50 ${directionUpLeft ? "bottom-full right-0 mb-2" : directionCenterLeft ? "lg:bottom-0 bottom-full lg:-right-12 right-0 lg:mb-6 mb-2" : " top-full left-0 mt-2"} bg-card border border-border rounded-[14px] shadow-xl px-5 py-3`}>
                    <DayPicker
                        mode="single"
                        selected={value}
                        onSelect={(date) => {
                            onChange(date)

                            if (date) {
                                onClose()
                            }
                        }}
                        captionLayout="dropdown"
                        startMonth={new Date(today.getFullYear() - 100, 0)}
                        endMonth={new Date(today.getFullYear() + 10, 11)}
                        defaultMonth={value || today}
                        className="text-sm"
                    />

                    <div className="flex justify-between border-t border-border pt-3 mt-2">

                        <button
                            type="button"
                            onClick={() => {
                                onChange(undefined)
                                onClose()
                            }}
                            className="text-xs font-semibold text-text-sm hover:text-text cursor-pointer"
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                onChange(today)
                                onClose()
                            }}
                            className="text-xs font-semibold text-text cursor-pointer"
                        >
                            Today
                        </button>

                    </div>

                </div>
            )}
        </div>
    )
}
