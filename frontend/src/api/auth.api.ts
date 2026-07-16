import api from "./axios";
import type { SignupInput } from "../validation/authValidation";

export async function signupApi(data: SignupInput) {
    return api.post("/api/auth/signup", data)
}