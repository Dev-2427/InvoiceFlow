export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    avatar: string | null,
    country: string | null,
    authProviders: { credentials: boolean, google: boolean },
    currentOrganization: string | null
}