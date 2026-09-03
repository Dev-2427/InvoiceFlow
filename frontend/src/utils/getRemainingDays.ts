export default function getRemainingDays(deletedAt: string) {
    const deletedDate = new Date(deletedAt)
    deletedDate.setHours(0, 0, 0, 0)

    const permanentDeletionDate = new Date(deletedDate)
    permanentDeletionDate.setDate(permanentDeletionDate.getDate() + 30)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const daysRemaining = Math.ceil(
       ( permanentDeletionDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
    )

    return Math.max(0, daysRemaining)

}