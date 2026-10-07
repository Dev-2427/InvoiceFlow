import { useEffect, useState } from "react";
import Header from "../../components/ui/Header";
import Profile from "../../components/settings/Profile";
import useAuthUser from "../../hooks/useAuthUser";
import { useLocation } from "react-router-dom";

type IScreen = "profile" | "password" | "organizations"

const screens: IScreen[] = ["profile", "password", "organizations"]

export default function Settings() {

    const location = useLocation()

    const [currentScreen, setCurrentScreen] = useState<IScreen>("profile")

    const user = useAuthUser()

    useEffect(() => {
        if (location.state?.changeScreen === "organizations") {
            setCurrentScreen("organizations")
        }
    }, [location.state])

    return (
        <main className="space-y-5 mb-5">
            <Header header="Settings" />

            {/* PageHeader */}
            <div className="px-5 lg:pt-4">

                <span className="text-text text-[22px] font-bold">Reports</span>

                <p className="text-[14px] text-text-sm">Manage your profile, password and organisation</p>
            </div>

            {/* screen selector */}
            <div className="px-5">
                <div className="flex items-center bg-card border-[1.5px] border-border rounded-lg w-fit px-1.5 py-1.5">
                    {screens.map((screen) => (
                        <button
                            onClick={() => setCurrentScreen(screen)}
                            key={screen}
                            type="button"
                            className={`flex justify-center items-center rounded-lg w-fit px-3 py-1.5 capitalize text-[13px] font-semibold ${currentScreen === screen ? "bg-navy-700 text-card" : "text-navy-700"} cursor-pointer`}>
                            {screen}
                        </button>
                    ))}
                </div>
            </div>

            {currentScreen === "profile" &&
                <Profile
                    user={user}
                />
            }

        </main>
    )
}
