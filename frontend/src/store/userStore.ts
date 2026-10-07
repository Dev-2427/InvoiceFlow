import { create } from "zustand";
import type { ApiResponse } from "../types/api.types";
import { updateAvatarApi, updateProfileApi } from "../api/user.api";
import authStore from "./authStore";
import type { UpdateProfileSchemaInput } from "../validation/user.validation";

interface IUserStore {
    isUpdatingAvatar: boolean,
    updateAvatar: (file: File) => Promise<ApiResponse<{ avatar: string }>>,

    isUpdatingProfile: boolean,
    updateProfile: (data: UpdateProfileSchemaInput) => Promise<ApiResponse<null>>
}

const userStore = create<IUserStore>((set) => ({
    isUpdatingAvatar: false,
    isUpdatingProfile: false,

    async updateAvatar(file) {
        set({ isUpdatingAvatar: true })
        try {
            const formData = new FormData()

            formData.append("avatar", file)

            const res = await updateAvatarApi(formData)

            if (res.data.success) {
                authStore.getState().changeUserAvatar(res.data.data.avatar)
            }

            return res.data
        } catch (error: any) {
            console.error("failed to update avatar:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        } finally {
            set({ isUpdatingAvatar: false })
        }
    },

    async updateProfile(data) {
        set({ isUpdatingProfile: true })

        try {
            const res = await updateProfileApi(data)

            if (res.data.success) {
                authStore.getState().changeUserProfile(
                    data.firstName,
                    data.lastName ?? "",
                    data.country ?? "",
                )
            }

            return res.data
        } catch (error: any) {
            console.error("failed to update profile:", error)
            return {
                success: false,
                message: "Something went wrong, please try again."
            }
        }finally{
            set({isUpdatingProfile: false})
        }
    },

}))

export default userStore