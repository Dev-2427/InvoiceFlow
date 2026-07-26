import { create } from "zustand";
import type { CreateOrganizationInput } from "../validation/organizationValidation";
import type { ApiResponse } from "../types/api.types";
import type { organizationData } from "../types/organization.types";
import { createOrganizationApi } from "../api/organization.api";

interface IOrganizationStore {
    isCreatingOrganization: boolean,

    organization: organizationData | null,

    createOrganization: (data: CreateOrganizationInput) => Promise<ApiResponse<{ organizationData: organizationData }>>
}

const organizationStore = create<IOrganizationStore>((set) => ({
    isCreatingOrganization: false,

    organization: null,

    async createOrganization(data) {
        set({ isCreatingOrganization: true })
        try {
            const res = await createOrganizationApi(data)

            if (res.data.success) {
                set({ organization: res.data.data.organizationData })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to create organization:", error);

            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isCreatingOrganization: false })
        }
    }
}))

export default organizationStore