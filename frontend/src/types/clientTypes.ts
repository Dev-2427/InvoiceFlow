type ClientSortType = "Created (Newest)" | "Created (Oldest)" | "Name A-Z" | "Name Z-A" | "Company A-Z" | "Company Z-A"

type SortField = "companyName" | "displayName" | "createdAt"

type ClientSortOrderType = "asc" | "desc"

type FilterType = "All" | "Business" | "Individual" | "Active" | "Inactive"
type LowercaseFilterType = "all" | "business" | "individual" | "active" | "inactive"

export interface IClientFilter {
    label: FilterType,
    filter: LowercaseFilterType
}


export interface IClientSort {
    label: ClientSortType,
    sort: SortField,
    order: ClientSortOrderType
}

export interface GetClientsResponseData {
    clients: {
        _id: string,
        companyName: string | null,
        displayName: string,
        email: string | null,
        phone: string | null,
        totalBilled: number,
        totalReceivable: number,
    }[]
    pagination: {
        page: number,
        limit: number,
        totalItems: number,
        totalPages: number
    }
}

export interface getClientsParams {
    sortBy: SortField,
    order: ClientSortOrderType,
    filter?: LowercaseFilterType
    search?: string,
    page: number,
    limit: number
}