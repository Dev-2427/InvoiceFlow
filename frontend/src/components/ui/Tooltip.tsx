interface TooltipProps {
    label: string
}

export default function Tooltip({ label }: TooltipProps) {
    return (
        <div className="absolute left-full rounded-lg bg-navy-700 text-card text-xs shadow-lg lg:group-hover:block ml-4 p-2 hidden z-50 whitespace-nowrap">
            {label}
        </div>
    )
}
