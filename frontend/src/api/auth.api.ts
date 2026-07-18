import api from "./axios";
import type { SignupInput, VerifyCodeInput, SigninInput, ForgotPasswordInput, ResetPasswordInput } from "../validation/authValidation";

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