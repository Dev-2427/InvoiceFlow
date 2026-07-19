import axios, { type AxiosResponse } from "axios"
import authStore from "../store/authStore"
import type { ApiResponse } from "../types/api.types"

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
    validateStatus: () => true
})

declare module "axios" {
    interface InternalAxiosRequestConfig {
        _retry?: boolean
    }
}

let refreshPromise: Promise<AxiosResponse<ApiResponse<unknown>>> | null = null

api.interceptors.response.use(async (response) => {
    const code = response.data.data?.code
    const originalRequest = response.config

    if (code !== "AUTH_CHECK_FAILED" && code !== "TOKEN_EXPIRED") return response

    if (originalRequest._retry) return (response)

    originalRequest._retry = true

    try {

        if (!refreshPromise) {
            refreshPromise = (async () => {
                try {
                    return await api.post<ApiResponse<unknown>>("/api/auth/refresh")
                } finally {
                    refreshPromise = null
                }
            })()
        }

        const refreshRes = await refreshPromise

        if (!refreshRes.data.success) {
            authStore.getState().forceLogout()
            return response
        }

        return api(originalRequest)
    } catch (error) {
        authStore.getState().forceLogout()
        return response
    }

})

export default api