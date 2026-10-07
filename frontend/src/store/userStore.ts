import { create } from "zustand";
import type { ApiResponse } from "../types/api.types";
import { updateAvatarApi } from "../api/user.api";
import authStore from "./authStore";

interface IUserStore {
    isUpdatingAvatar: boolean,
    updateAvatar: (file: File) => Promise<ApiResponse<{ avatar: string }>>
}

const userStore = create<IUserStore>((set, get) => ({
    isUpdatingAvatar: false,

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
}))

export default userStore