import { create } from "zustand";
import type { CreateOrganizationInput, OrganizationAddressInput, UpdateOrganizationInput } from "../validation/organizationValidation";
import type { ApiResponse } from "../types/api.types";
import type { getAllOrganizationsResponseData, organizationData } from "../types/organization.types";
import { createOrganizationApi, getAllOrganizationsApi, getOrganizationDataApi, removeOrganizationLogoApi, switchOrganizationApi, updateOrganizationDataApi, updateOrganizationLogoApi } from "../api/organization.api";

interface IOrganizationStore {
    isCreatingOrganization: boolean,
    isGettingOrganizationData: boolean,

    organization: organizationData | null,

    createOrganization: (data: CreateOrganizationInput) => Promise<ApiResponse<{ organizationData: organizationData }>>
    getOrganizationData: (id: string) => Promise<ApiResponse<{ organizationData: organizationData }>>,

    isUpdatingLogo: boolean,
    updateOrganizationLogo: (organizationId: string, file: File) => Promise<ApiResponse<{ logoUrl: string }>>,
    removeOrganizationLogo: (organizationId: string) => Promise<ApiResponse<null>>,
    isUpdatingOrganizationData: boolean,
    isUpdatingOrganizationAddress: boolean,
    updateOrganization: (organizationId: string, data: UpdateOrganizationInput | OrganizationAddressInput) => Promise<ApiResponse<{ organizationData: organizationData }>>

    isGettingAllOrganizations: boolean,
    allOrganizations: getAllOrganizationsResponseData[] | null,
    getAllOrganizations: () => Promise<ApiResponse<{ organizations: getAllOrganizationsResponseData[] }>>,
    switchingOrganizationId: string | null,
    switchOrganization: (organizationId: string) => Promise<ApiResponse<{ organizationData: organizationData }>>
}

const organizationStore = create<IOrganizationStore>((set) => ({
    isCreatingOrganization: false,
    isGettingOrganizationData: false,
    isUpdatingLogo: false,
    isUpdatingOrganizationData: false,
    isUpdatingOrganizationAddress: false,
    isGettingAllOrganizations: false,
    switchingOrganizationId: null,

    organization: null,
    allOrganizations: null,

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

    async updateOrganization(organizationId, data) {

        const isAddressUpdate = "address" in data

        if (isAddressUpdate) {
            set({ isUpdatingOrganizationAddress: true })
        } else {
            set({ isUpdatingOrganizationData: true })
        }
        try {

            const res = await updateOrganizationDataApi(organizationId, data)

            if (res.data.success) {
                set({ organization: res.data.data.organizationData })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to update organization data:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            if (isAddressUpdate) {
                set({ isUpdatingOrganizationAddress: false })
            } else {
                set({ isUpdatingOrganizationData: false })
            }
        }
    },

    async getAllOrganizations() {
        set({ isGettingAllOrganizations: true })

        try {
            const res = await getAllOrganizationsApi()

            if (res.data.success) {
                set({ allOrganizations: res.data.data.organizations })
            }
            console.log(res.data.data.organizations);

            return res.data
        } catch (error: any) {
            console.error("Failed to get all organization:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isGettingAllOrganizations: false })
        }
    },

    async switchOrganization(organizationId) {
        set({ switchingOrganizationId: organizationId })
        try {
            const res = await switchOrganizationApi(organizationId)

            if (res.data.success) {
                set({ organization: res.data.data.organizationData, allOrganizations: null })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to switch organization:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ switchingOrganizationId: null })
        }
    }

}))

export default organizationStore