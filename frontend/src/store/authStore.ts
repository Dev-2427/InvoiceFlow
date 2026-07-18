import { create } from "zustand"
import type { SignupInput, VerifyCodeInput, SigninInput, ForgotPasswordInput, ResetPasswordInput } from "../validation/authValidation"
import { forgotPasswordApi, googleAuthApi, resetPasswordApi, signinApi, signupApi, verifyCodeApi, verifyResetCodeApi } from "../api/auth.api"
import type { ApiResponse } from "../types/api.types"
import type { User } from "../types/auth.types"

interface IAuthStore {
    isSigningUp: boolean,
    isVerifyingCode: boolean,
    isSigningIn: boolean,
    isSendingMail: boolean,
    isVerifyingResetCode: boolean,
    isResettingPassword: boolean,

    signup: (data: SignupInput) => Promise<ApiResponse<{ userId: string }>>,
    verifyCode: (data: VerifyCodeInput) => Promise<ApiResponse<{ userData: User }>>
    signin: (data: SigninInput) => Promise<ApiResponse<{ userData: User }>>
    forgotPassword: (data: ForgotPasswordInput) => Promise<ApiResponse<{ userId: string }>>
    verifyResetCode: (data: VerifyCodeInput) => Promise<ApiResponse<null>>
    resetPassword: (data: ResetPasswordInput) => Promise<ApiResponse<null>>
    googleAuth: (code: string) => Promise<ApiResponse<{ userData: User }>>

    user: User | null
}

const authStore = create<IAuthStore>((set) => ({
    isSigningUp: false,
    isVerifyingCode: false,
    isSigningIn: false,
    isSendingMail: false,
    isVerifyingResetCode: false,
    isResettingPassword: false,

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
    },

    async forgotPassword(data) {
        try {
            set({ isSendingMail: true })

            const res = await forgotPasswordApi(data)

            return res.data
        } catch (error: any) {
            console.error("Failed to send email:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isSendingMail: false })
        }
    },

    async verifyResetCode(data) {
        set({ isVerifyingResetCode: true })

        try {
            const res = await verifyResetCodeApi(data)

            return res.data
        } catch (error: any) {
            console.error("Error verifying reset code:", error)

            return {
                success: false,
                message: "Something went wrong. Please try again."
            }
        } finally {
            set({ isVerifyingResetCode: false })
        }
    },

    async resetPassword(data) {
        try {
            set({ isResettingPassword: true })

            const res = await resetPasswordApi(data)

            return res.data
        } catch (error: any) {
            console.error("Failed to reset password:", error)

            return {
                success: false,
                message: "Something went wrong. Please try again."
            }
        } finally {
            set({ isResettingPassword: false })
        }
    },

    async googleAuth(code) {
        try {
            const res = await googleAuthApi(code)

            if (res.data.success) {
                set({ user: res.data.data.userData })
            }

            return res.data
        } catch (error) {
            console.error("Google authentication failed:", error);
            return {
                success: false,
                message: "Google authentication failed"
            }
        }
    }

}))

export default authStore