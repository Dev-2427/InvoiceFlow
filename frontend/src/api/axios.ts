import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
    validateStatus: () => true
})

export default api