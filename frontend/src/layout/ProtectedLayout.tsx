import { Navigate, Outlet } from "react-router-dom"
import Loading from "../pages/common/Loading"
import authStore from "../store/authStore"

export default function ProtectedLayout() {

    const isCheckingAuth = authStore((state) => state.isCheckingAuth)
    const isAuthenticated = authStore((state) => state.isAuthenticated)

    if (isCheckingAuth) {
        return <Loading />
    }

    if (!isAuthenticated) {
        return (
            <Navigate to="/signin" replace />
        )
    }

    return (
        <Outlet />
    )
}
