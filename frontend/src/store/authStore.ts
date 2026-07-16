import { create } from "zustand"
import type { SignupInput } from "../validation/authValidation"
import { signupApi } from "../api/auth.api"
import type { ApiResponse } from "../types/api"

interface IAuthStore {
    isSigningUp: boolean,
    signup: (data: SignupInput) => Promise<ApiResponse<{ userId: string }>>
}

const authStore = create<IAuthStore>((set) => ({
    isSigningUp: false,

    async signup(data) {
        set({ isSigningUp: true })

        try {
            const res = await signupApi(data)

            return res.data

        } catch (error) {
            console.error("Error signing up:", error)

            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isSigningUp: false })
        }
    },
}))

export default authStore