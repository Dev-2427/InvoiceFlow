import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ui/ScrollToTop";

export default function RootLayout () {
    return (
        <>
            <ScrollToTop />
            <Outlet />
        </>
    )
}
