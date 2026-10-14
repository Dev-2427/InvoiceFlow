import { useEffect, useState } from "react";
import Header from "../../components/ui/Header";
import Profile from "../../components/settings/Profile";
import useAuthUser from "../../hooks/useAuthUser";
import { useLocation } from "react-router-dom";
import Password from "../../components/settings/Password";
import organizationStore from "../../store/organizationStore";
import Organization from "../../components/settings/organization/Organization";
import Devices from "../../components/settings/Devices";
import authStore from "../../store/authStore";

type IScreen = "profile" | "password" | "organizations" | "devices"

const screens: IScreen[] = ["profile", "password", "organizations", "devices"]

export default function Settings() {

    const location = useLocation()

    const [currentScreen, setCurrentScreen] = useState<IScreen>("profile")

    const user = useAuthUser()
    const removeAllSessionState = authStore((state) => state.removeAllSessionState)

    const organization = organizationStore((state) => state.organization)
    const removeAllOrganizations = organizationStore((state) => state.removeAllOrganizations)

    useEffect(() => {
        if (location.state?.changeScreen === "organizations") {
            setCurrentScreen("organizations")
        }
    }, [location.state])

    useEffect(() => {
        return () => {
            removeAllOrganizations()
            removeAllSessionState()
        }
    }, [])

    const showPasswordScreen = user.authProviders.credentials

    return (
        <main className="space-y-5 mb-5">
            <Header header="Settings" />

            {/* PageHeader */}
            <div className="px-5 lg:pt-4">

                <span className="text-text text-[22px] font-bold">Settings</span>

                <p className="text-[14px] text-text-sm">Manage your profile, password and organisation</p>
            </div>

            {/* screen selector */}
            <div className="px-5">
                <div className="flex items-center bg-card border-[1.5px] border-border rounded-lg w-fit px-1.5 py-1.5">
                    {screens.map((screen) => {
                        if (!showPasswordScreen && screen === "password") return
                        return (
                            <button
                                onClick={() => setCurrentScreen(screen)}
                                key={screen}
                                type="button"
                                className={`flex justify-center items-center rounded-lg w-fit px-3 py-1.5 capitalize text-[13px] font-semibold ${currentScreen === screen ? "bg-navy-700 text-card" : "text-navy-700"} cursor-pointer`}>
                                {screen}
                            </button>
                        )
                    })}
                </div>
            </div>

            {currentScreen === "profile" ?
                <Profile
                    user={user}
                />

                :
                currentScreen === "password" ?
                    <Password />

                    :
                    currentScreen === "organizations" ?
                        <Organization
                            organization={organization!}
                        />

                        :

                        currentScreen === "devices" &&
                        <Devices />
            }

        </main>
    )
}
