import { create } from "zustand";
import type { CreateOrganizationInput } from "../validation/organizationValidation";
import type { ApiResponse } from "../types/api.types";
import type { organizationData } from "../types/organization.types";
import { createOrganizationApi, getOrganizationDataApi, removeOrganizationLogoApi, updateOrganizationLogoApi } from "../api/organization.api";

interface IOrganizationStore {
    isCreatingOrganization: boolean,
    isGettingOrganizationData: boolean,

    organization: organizationData | null,

    createOrganization: (data: CreateOrganizationInput) => Promise<ApiResponse<{ organizationData: organizationData }>>
    getOrganizationData: (id: string) => Promise<ApiResponse<{ organizationData: organizationData }>>,

    isUpdatingLogo: boolean,
    updateOrganizationLogo: (organizationId: string, file: File) => Promise<ApiResponse<{ logoUrl: string }>>,
    removeOrganizationLogo: (organizationId: string) => Promise<ApiResponse<null>>,
}

const organizationStore = create<IOrganizationStore>((set) => ({
    isCreatingOrganization: false,
    isGettingOrganizationData: false,
    isUpdatingLogo: false,

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
    },

    async getOrganizationData(id: string) {
        set({ isGettingOrganizationData: true })

        try {
            const res = await getOrganizationDataApi(id)

            if (res.data.success) {
                set({ organization: res.data.data.organizationData })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to fetch organization data:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isGettingOrganizationData: false })
        }
    },

    async updateOrganizationLogo(organizationId, file) {
        set({ isUpdatingLogo: true })
        try {

            const formData = new FormData()

            formData.append("logo", file)

            const res = await updateOrganizationLogoApi(organizationId, formData)

            if (res.data.success) {
                set((state) => {
                    if (!state.organization) return state
                    return {
                        organization: {
                            ...state.organization,
                            logo: { url: res.data.data.logoUrl }
                        }
                    }
                })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to update organization logo:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isUpdatingLogo: false })
        }
    },

    async removeOrganizationLogo(organizationId) {
        set({ isUpdatingLogo: true })
        try {
            const res = await removeOrganizationLogoApi(organizationId)

            if (res.data.success) {
                set((state) => {
                    if (!state.organization) return state

                    return {
                        organization: {
                            ...state.organization,
                            logo: null
                        }
                    }
                })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to remove organization logo:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isUpdatingLogo: false })
        }
    },

}))

export default organizationStore