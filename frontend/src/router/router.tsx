import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import Signup from "../pages/auth/Signup";
import VerifyCode from "../pages/auth/VerifyCode";
import Signin from "../pages/auth/Signin";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyResetCode from "../pages/auth/VerifyResetCode";
import ResetPassword from "../pages/auth/ResetPassword";

export const router = createBrowserRouter([
    {
        path: "/",
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
])