import type { CreateOrganizationInput } from "../validation/organizationValidation";
import api from "./axios";

export function createOrganizationApi(data: CreateOrganizationInput) {
    return api.post("/api/organization", data)
}

export function getOrganizationDataApi(organizationId: string) {
    return api.get(`/api/organization/${organizationId}`)
}

export function updateOrganizationLogoApi(organizationId: string, formData: FormData) {
    return api.patch(`/api/organization/${organizationId}/logo`, formData)
}

export function removeOrganizationLogoApi(organizationId: string) {
    return api.delete(`/api/organization/${organizationId}/logo`,)
}