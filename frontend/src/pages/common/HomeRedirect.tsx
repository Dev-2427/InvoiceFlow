import { Navigate } from "react-router-dom"
import authStore from "../../store/authStore"
import Loading from "./Loading"

export default function HomeRedirect() {

    const isCheckingAuth = authStore((state) => state.isCheckingAuth)
    const isAuthenticated = authStore((state) => state.isAuthenticated)
    const user = authStore((state) => state.user)

    if (isCheckingAuth) {
        return <Loading />
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />
    }

    return (
        <Navigate to={user.currentOrganization ? "/dashboard" : "/create-organization"} replace />
    )
}
