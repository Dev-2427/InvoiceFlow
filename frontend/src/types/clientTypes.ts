type ClientSortType = "Created (Newest)" | "Created (Oldest)" | "Name A-Z" | "Name Z-A" | "Company A-Z" | "Company Z-A"

type SortField = "companyName" | "displayName" | "createdAt"

type ClientSortOrderType = "asc" | "desc"

export type ClientFilterType = "All" | "Business" | "Individual" | "Active" | "Inactive" | "Overdue"


export interface IClientSort {
    label: ClientSortType,
    sort: SortField,
    order: ClientSortOrderType
}