import type { UpdateProfileSchemaInput } from "../validation/user.validation";
import api from "./axios";

export function updateAvatarApi(formData: FormData) {
    return api.patch("/api/profile/avatar", formData)
}

export function updateProfileApi(data: UpdateProfileSchemaInput) {
    return api.patch("/api/profile", data)
}