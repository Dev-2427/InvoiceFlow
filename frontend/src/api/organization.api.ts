import type { CreateOrganizationInput } from "../validation/organizationValidation";
import api from "./axios";

export function createOrganizationApi(data: CreateOrganizationInput) {
    return api.post("/api/organization", data)
}