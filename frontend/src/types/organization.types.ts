interface Address {
    street1: string,
    street2: string | null,
    city: string,
    pincode: string
    state: string,
    country: string,
}

export interface organizationData {
    id: string,
    organizationName: string,
    logo: { url: string } | null,
    email: string,
    phone: string | null,
    gstNumber: string | null,
    currency: { code: string, symbol: string },
    address: Address,
    termsAndConditions: string,
    createdAt: Date
}
