import { create } from "zustand"
import type { SignupInput, VerifyCodeInput, SigninInput, ForgotPasswordInput, ResetPasswordInput, ChangePasswordInput } from "../validation/authValidation"
import { changePasswordApi, checkAuthApi, deleteUserAccountApi, forgotPasswordApi, getActiveSessionsApi, googleAuthApi, resetPasswordApi, signinApi, signoutApi, signoutSessionApi, signupApi, verifyCodeApi, verifyResetCodeApi } from "../api/auth.api"
import type { ApiResponse } from "../types/api.types"
import type { Session, User } from "../types/auth.types"

interface IAuthStore {
    isSigningUp: boolean,
    isVerifyingCode: boolean,
    isSigningIn: boolean,
    isSendingMail: boolean,
    isVerifyingResetCode: boolean,
    isResettingPassword: boolean,
    isSigningout: boolean,
    isCheckingAuth: boolean,
    isAuthenticated: boolean,

    changeUserAvatar: (avatar: string | null) => void,
    changeUserProfile: (firstName: string, lastName: string, country: string,) => void,

    signup: (data: SignupInput) => Promise<ApiResponse<{ userId: string }>>,
    verifyCode: (data: VerifyCodeInput) => Promise<ApiResponse<{ userData: User }>>
    signin: (data: SigninInput) => Promise<ApiResponse<{ userData: User }>>
    forgotPassword: (data: ForgotPasswordInput) => Promise<ApiResponse<{ userId: string }>>
    verifyResetCode: (data: VerifyCodeInput) => Promise<ApiResponse<null>>
    resetPassword: (data: ResetPasswordInput) => Promise<ApiResponse<null>>
    googleAuth: (code: string) => Promise<ApiResponse<{ userData: User }>>
    checkAuth: () => Promise<ApiResponse<{ userData: User }>>
    signout: () => Promise<ApiResponse<null>>
    forceLogout: () => void,

    user: User | null,

    isChangingPassword: boolean,
    changePassword: (data: ChangePasswordInput) => Promise<ApiResponse<null>>,

    isDeletingUserAccount: boolean,
    deleteUserAccount: () => Promise<ApiResponse<null>>,

    isGettingActiveSessions: boolean,
    getActiveSessions: () => Promise<ApiResponse<{ sessions: Session[] }>>,
    activeSessions: Session[] | null,
    isSigningoutSession: boolean,
    signingOutSessionId: string | null,
    signoutSession: (sessionId: string) => Promise<ApiResponse<null>>
}

const authStore = create<IAuthStore>((set, get) => ({
    isSigningUp: false,
    isVerifyingCode: false,
    isSigningIn: false,
    isSendingMail: false,
    isVerifyingResetCode: false,
    isResettingPassword: false,
    isSigningout: false,
    isAuthenticated: false,
    isCheckingAuth: true,
    isChangingPassword: false,
    isDeletingUserAccount: false,
    isGettingActiveSessions: false,
    isSigningoutSession: false,
    signingOutSessionId: null,

    user: null,
    activeSessions: null,

    changeUserAvatar(avatar) {
        set((state) => {
            if (!state.user) return state

            return {
                user: { ...state.user, avatar }
            }
        })
    },

    changeUserProfile(firstName, lastName, country) {
        set((state) => {
            if (!state.user) return state

            return {
                user: { ...state.user, firstName, lastName, country }
            }
        })
    },

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
                set({ user: res.data.data.userData, isAuthenticated: true })
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
                set({ user: res.data.data.userData, isAuthenticated: true })
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
                set({ user: res.data.data.userData, isAuthenticated: true })
            }

            return res.data
        } catch (error) {
            console.error("Google authentication failed:", error);
            return {
                success: false,
                message: "Google authentication failed"
            }
        }
    },

    async checkAuth() {
        try {
            const res = await checkAuthApi()

            if (res.data.success) {
                set({ user: res.data.data.userData, isAuthenticated: true })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to fetch user data:", error)

            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    async signout() {
        set({ isSigningout: true })

        try {
            const res = await signoutApi()

            if (res.data.success) {
                set({ user: null, isAuthenticated: false })
            }

            return res.data
        } catch (error) {
            console.error("Failed to sign out:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isSigningout: false })
        }
    },

    forceLogout() {
        set({ user: null, isAuthenticated: false })
    },

    async changePassword(data) {
        set({ isChangingPassword: true })

        try {
            const res = await changePasswordApi(data)

            if (res.data.success) {
                get().forceLogout()
            }

            return res.data
        } catch (error) {
            console.error("Failed to change password:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isChangingPassword: false })
        }
    },

    async deleteUserAccount() {
        set({ isDeletingUserAccount: true })

        try {
            const res = await deleteUserAccountApi()

            if (res.data.success) {
                get().forceLogout()
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to delete user account:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isDeletingUserAccount: false })
        }
    },

    async getActiveSessions() {
        set({ isGettingActiveSessions: true })
        try {
            const res = await getActiveSessionsApi()

            if (res.data.success) {
                set({ activeSessions: res.data.data.sessions })
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to fetch active sessions:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isGettingActiveSessions: false })
        }
    },

    async signoutSession(sessionId) {
        set({ isSigningoutSession: true, signingOutSessionId: sessionId })
        try {

            const activeSessions = get().activeSessions

            if (!activeSessions) {
                return {
                    success: false,
                    message: "No session found"
                }
            }

            const res = await signoutSessionApi(sessionId)

            if (res.data.success) {
                const currentSession = activeSessions.find((session) => session.currentSession === true)

                if (currentSession?.sessionId === sessionId) {
                    set({ user: null, isAuthenticated: false, activeSessions: null })
                } else {
                    set((state) => {
                        if (!state.activeSessions) return state
                        return {
                            activeSessions: state.activeSessions.filter((session) => session.sessionId !== sessionId)
                        }
                    })
                }
            }

            return res.data
        } catch (error: any) {
            console.error("Failed to signout session:", error)
            return {
                success: false,
                message: "Something went wrong. please try again."
            }
        } finally {
            set({ isSigningoutSession: false, signingOutSessionId: null })
        }
    },

}))

export default authStore