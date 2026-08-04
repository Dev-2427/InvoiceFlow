import type { CreateOrganizationInput } from "../validation/organizationValidation";
import api from "./axios";

export function createOrganizationApi(data: CreateOrganizationInput) {
    return api.post("/api/organization", data)
}

export function getOrganizationDataApi(organizationId: string) {
    return api.get(`/api/organization/${organizationId}`)
}