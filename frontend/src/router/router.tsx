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
import AppLayout from "../layout/AppLayout";
import Clients from "../pages/client/Clients";
import CreateClient from "../pages/client/CreateClient";
import ClientDetails from "../pages/client/ClientDetails";
import EditClient from "../pages/client/EditClient";
import Invoice from "../pages/invoice/Invoice";
import CreateInvoice from "../pages/invoice/CreateInvoice";
import InvoiceDetails from "../pages/invoice/InvoiceDetails";
import RestoreInvoices from "../pages/invoice/RestoreInvoices";

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
                element: <AppLayout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard />
                    },
                    {
                        path: "/clients",
                        element: <Clients />
                    },
                    {
                        path: "/clients/new",
                        element: <CreateClient />
                    },
                    {
                        path: "/clients/:id",
                        element: <ClientDetails />
                    },
                    {
                        path: "/clients/:id/edit",
                        element: <EditClient />
                    },
                    {
                        path: "/invoices",
                        element: <Invoice />
                    },
                    {
                        path: "/invoices/new",
                        element: <CreateInvoice />
                    },
                    {
                        path: "/invoices/:invoiceId",
                        element: <InvoiceDetails />
                    },
                    {
                        path: "/invoices/restore",
                        element: <RestoreInvoices />
                    }

                ]
            }
        ]
    },
    {
        path: "/*",
        element: <NotFound />
    }
])