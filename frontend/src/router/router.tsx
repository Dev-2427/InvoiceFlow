import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import Signup from "../pages/auth/Signup";
import VerifyCode from "../pages/auth/VerifyCode";
import Signin from "../pages/auth/Signin";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyResetCode from "../pages/auth/VerifyResetCode";
import ResetPassword from "../pages/auth/ResetPassword";
import PublicLayout from "../layout/PublicLayout";
import ProtectedLayout from "../layout/ProtectedLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import CreateOrganization from "../pages/organization/CreateOrganization";
import HomeRedirect from "../pages/common/HomeRedirect";
import NotFound from "../pages/common/NotFound";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeRedirect />
    },
    {
        element: <PublicLayout />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: "/signup",
                        element: <Signup />
                    },
                    {
                        path: "/verify-code/:userId",
                        element: <VerifyCode />
                    },
                    {
                        path: "/signin",
                        element: <Signin />
                    },
                    {
                        path: "/forgot-password",
                        element: <ForgotPassword />
                    },
                    {
                        path: "/verify-reset-code/:userId",
                        element: <VerifyResetCode />
                    },
                    {
                        path: "/reset-password",
                        element: <ResetPassword />
                    },
                ]
            }
        ]
    },
    {
        element: <ProtectedLayout />,
        children: [
            {
                path: "/create-organization",
                element: <CreateOrganization />
            },
            {
                path: "/dashboard",
                element: <Dashboard />
            }
        ]
    },
    {
        path: "/*",
        element: <NotFound />
    }
])