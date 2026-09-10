export default function formatLocalDate(date: Date) {
    return new Date(date).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
}