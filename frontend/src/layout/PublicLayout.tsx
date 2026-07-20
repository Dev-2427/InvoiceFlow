import { Navigate, Outlet } from "react-router-dom";
import Loading from "../pages/common/Loading";
import authStore from "../store/authStore";

export default function PublicLayout() {

    const isCheckingAuth = authStore((state) => state.isCheckingAuth)
    const isAuthenticated = authStore((state) => state.isAuthenticated)
    const user = authStore((state) => state.user)

    if (isCheckingAuth) {
        return <Loading />
    }

    if (isAuthenticated) {
        return (<Navigate
            to={user?.currentOrganization ? "/dashboard" : "/create-organization"} replace
        />)
    }

    return <Outlet />
}
