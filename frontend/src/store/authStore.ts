import { create } from "zustand"
import type { SignupInput, VerifyCodeInput } from "../validation/authValidation"
import { signupApi, verifyCodeApi } from "../api/auth.api"
import type { ApiResponse } from "../types/api.types"
import type { User } from "../types/auth.types"

interface IAuthStore {
    isSigningUp: boolean,
    isVerifyingCode: boolean,
    signup: (data: SignupInput) => Promise<ApiResponse<{ userId: string }>>,
    verifyCode: (data: VerifyCodeInput) => Promise<ApiResponse<{ userData: User }>>

    user: User | null
}

const authStore = create<IAuthStore>((set, get) => ({
    isSigningUp: false,
    isVerifyingCode: false,

    user: null,

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

    async verifyCode(data) {
        set({ isVerifyingCode: true })

        try {
            const res = await verifyCodeApi(data)

            if (res.data.success) {
                set({ user: res.data.data.userData })
            }

            return res.data
        } catch (error) {
            console.error("Error verifying code:", error)

            return {
                success: false,
                message: "Something went wrong. Please try again."
            }
        } finally {
            set({ isVerifyingCode: false })
        }
    },

}))

export default authStore