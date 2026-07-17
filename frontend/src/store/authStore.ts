import { create } from "zustand"
import type { SignupInput, VerifyCodeInput, SigninInput } from "../validation/authValidation"
import { signinApi, signupApi, verifyCodeApi } from "../api/auth.api"
import type { ApiResponse } from "../types/api.types"
import type { User } from "../types/auth.types"

interface IAuthStore {
    isSigningUp: boolean,
    isVerifyingCode: boolean,
    isSigningIn: boolean,

    signup: (data: SignupInput) => Promise<ApiResponse<{ userId: string }>>,
    verifyCode: (data: VerifyCodeInput) => Promise<ApiResponse<{ userData: User }>>
    signin: (data: SigninInput) => Promise<ApiResponse<{ userData: User }>>

    user: User | null
}

const authStore = create<IAuthStore>((set) => ({
    isSigningUp: false,
    isVerifyingCode: false,
    isSigningIn: false,

    user: null,

    async signup(data) {
        set({ isSigningUp: true })

        try {
            const res = await signupApi(data)

            return res.data

        } catch (error: any) {
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
        } catch (error: any) {
            console.error("Error verifying code:", error)

            return {
                success: false,
                message: "Something went wrong. Please try again."
            }
        } finally {
            set({ isVerifyingCode: false })
        }
    },

    async signin(data) {
        try {
            set({ isSigningIn: true })

            const res = await signinApi(data)

            if (res.data.success) {
                set({ user: res.data.data.userData })
            }

            return res.data
        } catch (error: any) {
            console.error("Error signing in:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isSigningIn: false })
        }
    }

}))

export default authStore