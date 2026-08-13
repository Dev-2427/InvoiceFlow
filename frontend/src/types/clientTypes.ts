type ClientSortType = "Created (Newest)" | "Created (Oldest)" | "Name A-Z" | "Name Z-A" | "Company A-Z" | "Company Z-A"

type SortField = "companyName" | "displayName" | "createdAt"

type ClientSortOrderType = "asc" | "desc"

type FilterType = "All" | "Business" | "Individual" | "Active" | "Inactive"
type LowercaseFilterType = "all" | "business" | "individual" | "active" | "inactive"

interface Address {
    street1: String,
    street2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
}

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

export interface ClientData {
    _id: string,
    organization: string,
    clientType: "individual" | "business",
    status: "active" | "inactive",
    salutation: "Mr." | "Mrs." | "Ms." | "Dr." | "Prof.",
    firstName: string | null,
    lastName: string | null,
    companyName: string | null,
    displayName: string,
    email: string | null,
    phone: string | null,
    billingAddress: Address | null,
    shippingAddress: Address | null,
    createdAt: Date,
    updatedAt: Date,
}