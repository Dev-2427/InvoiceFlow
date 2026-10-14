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

export interface Session {
    sessionId: string,
    createdAt: string,
    currentSession: boolean,
    deviceName: string,
    browser: string,
    os: string,
    lastUsedAt: string,
    ipAddress: string
}