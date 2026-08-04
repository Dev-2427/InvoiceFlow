import { Navigate, Outlet } from "react-router-dom"
import Loading from "../pages/common/Loading"
import authStore from "../store/authStore"
import { useEffect } from "react"
import organizationStore from "../store/organizationStore"
import toast from "react-hot-toast"

export default function ProtectedLayout() {

    const isCheckingAuth = authStore((state) => state.isCheckingAuth)
    const isAuthenticated = authStore((state) => state.isAuthenticated)
    const user = authStore((state) => state.user)

    const getOrganizationData = organizationStore((state) => state.getOrganizationData)

    useEffect(() => {
        if (!isAuthenticated) return

        if (!user?.currentOrganization) return

        async function initializeOrganization() {
            const res = await getOrganizationData(user.currentOrganization)

            if (!res.success) {
                toast.error(res.message)
            }
        }

        initializeOrganization()
    }, [isAuthenticated])

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
