export function formatCurrency(value: number) {
    return new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2
    }).format(value)
}