import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layout/AuthLayout";
import Signup from "../pages/auth/Signup";
import VerifyCode from "../pages/auth/VerifyCode";

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
        ]
    }
])