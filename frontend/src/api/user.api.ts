import api from "./axios";

export function updateAvatarApi(formData: FormData) {
    return api.patch("/api/profile/avatar", formData)
}