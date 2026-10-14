import api from "./axios";
import type { SignupInput, VerifyCodeInput, SigninInput, ForgotPasswordInput, ResetPasswordInput, ChangePasswordInput } from "../validation/authValidation";

export function signupApi(data: SignupInput) {
    return api.post("/api/auth/signup", data)
}

export function verifyCodeApi(data: VerifyCodeInput) {
    return api.post("/api/auth/verify-email", data)
}

export function signinApi(data: SigninInput) {
    return api.post("/api/auth/signin", data)
}

export function forgotPasswordApi(data: ForgotPasswordInput) {
    return api.post("/api/auth/forgot-password", data)
}

export function verifyResetCodeApi(data: VerifyCodeInput) {
    return api.post("/api/auth/verify-reset-code", data)
}

export function resetPasswordApi(data: ResetPasswordInput) {
    return api.post("/api/auth/reset-password", { password: data.password })
}

export function googleAuthApi(code: string) {
    return api.post("/api/auth/google", { code })
}

export function checkAuthApi() {
    return api.get("/api/auth/me")
}

export function signoutApi() {
    return api.post("/api/auth/signout")
}

export function changePasswordApi(data: ChangePasswordInput) {

    const finalData = {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
    }

    return api.patch("/api/auth/change-password", finalData)
}

export function deleteUserAccountApi() {
    return api.delete("/api/auth/account")
}

export function getActiveSessionsApi() {
    return api.get("/api/auth/sessions")
}