export function formatCompactCurrency(
    value: number,
    symbol: string
) {
    return `${symbol}${new Intl.NumberFormat(undefined, {
        notation: "compact",
        maximumFractionDigits: 1
    }).format(value)}`
}