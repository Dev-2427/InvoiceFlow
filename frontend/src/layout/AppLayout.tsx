import { Link, NavLink, Outlet } from "react-router-dom"
import { HiSquares2X2, HiOutlineDocumentText, HiUsers, HiChartBar, HiCog6Tooth, HiBuildingOffice2 } from "react-icons/hi2"
import { RiArrowDownSFill } from "react-icons/ri";
import { TbLayoutSidebar, TbPlus } from "react-icons/tb";
import { HiXMark } from "react-icons/hi2";
import uiStore from "../store/uiStore";
import Tooltip from "../components/ui/Tooltip";
import organizationStore from "../store/organizationStore";
import { useEffect, useRef, useState } from "react";
import OrganizationSkeleton from "../components/loading/organization/OrganizationSkeleton";
import useAuthUser from "../hooks/useAuthUser";

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

    const user = useAuthUser()

    const organization = organizationStore((state) => state.organization)

    const isSidebarOpen = uiStore((state) => state.isSidebarOpen)
    const closeSidebar = uiStore((state) => state.closeSidebar)
    const isSidebarCollapsed = uiStore((state) => state.isSidebarCollapsed)
    const toggleSidebarCollapsed = uiStore((state) => state.toggleSidebarCollapsed)

    const [showOrgContextMenu, setShowOrgContextMenu] = useState(false)

    const orgContextRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {

        document.body.classList.add("bg-page")

        function handleOutsideClick(e: MouseEvent) {
            if (orgContextRef.current && !orgContextRef.current.contains(e.target as Node)) {
                setShowOrgContextMenu(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
            document.body.classList.remove("bg-page")
        }
    }, [])

    return (
        <div className="flex min-h-screen ">

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 lg:hidden z-40"
                    onClick={closeSidebar}
                />
            )}

            {/* sidebar  */}
            <aside className={`fixed lg:sticky top-0 left-0 flex flex-col h-screen w-64 shrink-0 bg-navy-800 p-5 gap-7 transition-all duration-300 ease-in-out z-50 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${isSidebarCollapsed && "lg:w-18 lg:items-center"}`}>

                {/* branding */}
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


                {/* organization section  */}
                {!organization ?
                    <OrganizationSkeleton />
                    :
                    <button
                        ref={orgContextRef}
                        type="button"
                        onClick={() => setShowOrgContextMenu(prev => !prev)}
                        className="flex relative justify-between items-center bg-navy-700 border border-border/10 p-3 rounded-lg cursor-pointer">


                        <div className="flex min-w-0 gap-2 items-center">
                            {organization.logo?.url ?
                                (
                                    <img className="rounded-lg h-8 w-8 object-cover shrink-0" src={organization.logo?.url} />
                                )
                                :
                                (
                                    <div className="flex justify-center items-center rounded-lg w-8 h-8 bg-gold text-gold-dark font-bold text-lg shrink-0">
                                        {organization.organizationName.charAt(0).toUpperCase()}
                                    </div>
                                )
                            }

                            <div className={`min-w-0 text-start ${isSidebarCollapsed && "lg:hidden"}`}>
                                <p className="truncate text-card text-sm font-bold">{organization.organizationName}</p>
                                <p className="truncate text-text-xs text-xs">{organization.currency.code}</p>
                            </div>

                        </div>

                        <RiArrowDownSFill className={`shrink-0 ${showOrgContextMenu && "rotate-180"} text-text-xs transition-transform duration-200 ${isSidebarCollapsed && "lg:hidden"}`} size={25} />

                        {/* organization context menu  */}
                        {showOrgContextMenu &&
                            <div className={`absolute top-full left-0 right-0 z-50 mt-1 px-3 w-full bg-navy-900 text-gold rounded-lg border border-border/20 text-xs font-bold ${isSidebarCollapsed && "lg:top-0 lg:left-full lg:right-auto lg:w-fit lg:whitespace-nowrap lg:ml-3"}`}>

                                <Link
                                    to={"/create-organization"}
                                    onClick={() => {
                                        closeSidebar()
                                        setShowOrgContextMenu(false)
                                    }}
                                    className="flex items-center gap-1 py-3 border-b hover:text-gold/70 border-border/20">
                                    <TbPlus />
                                    <span>Create Organization</span>
                                </Link>

                                <Link
                                    to={"/settings"}
                                    state={{ changeScreen: "organizations" }}
                                    onClick={() => {
                                        closeSidebar()
                                        setShowOrgContextMenu(false)
                                    }}
                                    className="flex items-center gap-1 py-3 hover:text-gold/70">
                                    <HiCog6Tooth />
                                    <span>Organization Settings</span>
                                </Link>
                            </div>
                        }
                    </button>
                }


                {/* navlinks  */}
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


                {/* user section  */}
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
