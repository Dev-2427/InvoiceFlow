import { Navigate, Outlet, useLocation } from "react-router-dom"
import Loading from "../pages/common/Loading"
import authStore from "../store/authStore"
import { useEffect } from "react"
import organizationStore from "../store/organizationStore"
import toast from "react-hot-toast"

export default function ProtectedLayout() {

    const location = useLocation()

    const isCheckingAuth = authStore((state) => state.isCheckingAuth)
    const isAuthenticated = authStore((state) => state.isAuthenticated)
    const user = authStore((state) => state.user)

    const getOrganizationData = organizationStore((state) => state.getOrganizationData)

    useEffect(() => {
        if (!isAuthenticated || !user || !user.currentOrganization) return

        const organisationId = user.currentOrganization

        async function initializeOrganization() {
            const res = await getOrganizationData(organisationId)

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

    if (!user?.currentOrganization && location.pathname !== "/create-organization") {
        return (
            <Navigate to={"/create-organization"} replace />
        )
    }

    return (
        <Outlet />
    )
}
