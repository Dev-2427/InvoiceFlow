import api from "./axios";
import type { SignupInput, VerifyCodeInput } from "../validation/authValidation";

export function signupApi(data: SignupInput) {
    return api.post("/api/auth/signup", data)
}

export function verifyCodeApi(data: VerifyCodeInput) {
    return api.post("/api/auth/verify-email", data)
}