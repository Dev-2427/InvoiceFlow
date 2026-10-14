export default function formatTimeAgo(date: string | Date): string {
    const timestamp = new Date(date).getTime()
    const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000)

    if (diffInSeconds < 60) {
        return "just now"
    }

    const minutes = Math.floor(diffInSeconds / 60)

    if (minutes < 60) {
        return `${minutes}m ago`
    }

    const hours = Math.floor(minutes / 60)

    if (hours < 24) {
        return `${hours}h ago`
    }

    const days = Math.floor(hours / 24)

    return `${days}d ago`
}