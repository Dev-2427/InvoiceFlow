import { NavLink, Outlet } from "react-router-dom"
import { HiSquares2X2, HiOutlineDocumentText, HiUsers, HiChartBar, HiCog6Tooth, HiBuildingOffice2 } from "react-icons/hi2"
import { TbLayoutSidebar } from "react-icons/tb";
import authStore from "../store/authStore"
import { HiXMark } from "react-icons/hi2";
import uiStore from "../store/uiStore";
import Tooltip from "../components/ui/Tooltip";

export default function AppLayout() {

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: HiSquares2X2
        },
        {
            name: "Invoices",
            path: "/invoices",
            icon: HiOutlineDocumentText
        },
        {
            name: "Clients",
            path: "/clients",
            icon: HiUsers
        },
        {
            name: "Reports",
            path: "/reports",
            icon: HiChartBar
        },
        {
            name: "Settings",
            path: "/settings",
            icon: HiCog6Tooth
        }
    ]

    const user = authStore((state) => state.user)

    const isSidebarOpen = uiStore((state) => state.isSidebarOpen)
    const closeSidebar = uiStore((state) => state.closeSidebar)

    const isSidebarCollapsed = uiStore((state) => state.isSidebarCollapsed)
    const toggleSidebarCollapsed = uiStore((state) => state.toggleSidebarCollapsed)

    return (
        <div className="flex min-h-screen overflow-y-auto">

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-40"
                    onClick={closeSidebar}
                />
            )}

            <aside className={`fixed lg:static top-0 left-0 flex flex-col h-screen w-64 shrink-0 bg-navy-800 p-5 gap-5 transition-all duration-300 ease-in-out z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${isSidebarCollapsed && "lg:w-18 lg:items-center"}`}>

                <div className="flex justify-between items-center">

                    <div className={`flex items-center gap-3 ${isSidebarCollapsed && "lg:hidden"}`}>
                        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gold">
                            <HiBuildingOffice2 className="text-xl text-gold-dark" />
                        </div>

                        <div>
                            <p className="text-card text-lg font-bold">InvoiceFlow</p>
                            <p className="text-xs text-text-xs">Invoice Manager</p>
                        </div>

                    </div>

                    <HiXMark className="text-text-xs text-2xl cursor-pointer hover:opacity-70 lg:hidden" onClick={closeSidebar} />

                    <TbLayoutSidebar className="hidden lg:flex text-text-xs text-2xl cursor-pointer hover:opacity-70" onClick={toggleSidebarCollapsed} />


                </div>


                {/* todo - current organization details */}


                <div className="space-y-1">

                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                to={item.path}
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `group relative flex items-center gap-3 ${isActive ? "bg-gold text-gold-dark" : "text-text-xs hover:bg-navy-700 hover:text-card transition-colors"} rounded-lg px-3 py-2 font-bold `
                                }
                                key={item.name}>
                                <Icon className={` text-[18px] ${isSidebarCollapsed && "lg:text-[20px]"}`} />
                                <span className={`text-[16px] ${isSidebarCollapsed && "lg:hidden"}`}>{item.name}</span>

                                {isSidebarCollapsed &&
                                    <Tooltip label={item.name} />
                                }
                            </NavLink>
                        )
                    })}
                </div>


                <div className="flex gap-2 items-center mt-auto border-t border-border/30 pt-5">
                    {user.avatar ?
                        (
                            <img className="rounded-lg h-8 w-8 object-cover shrink-0" src={user.avatar} />
                        )
                        :
                        (
                            <div className="flex justify-center items-center rounded-lg w-8 h-8 bg-gold text-gold-dark font-bold text-lg shrink-0">
                                {user.firstName.charAt(0).toUpperCase()}
                            </div>
                        )
                    }

                    <div className={`min-w-0 ${isSidebarCollapsed && "lg:hidden"}`}>
                        <p className="truncate text-card text-sm font-bold">{user.firstName} {user.lastName}</p>
                        <p className="truncate text-text-xs text-xs">{user.email}</p>
                    </div>
                </div>


            </aside>

            <main className="flex-1">
                <Outlet />
            </main>
        </div >
    )
}
