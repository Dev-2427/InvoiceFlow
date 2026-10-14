import toast from "react-hot-toast"
import authStore from "../../store/authStore"
import formatTimeAgo from "../../utils/formateTimeAgo"
import { TbPower, TbRefresh } from "react-icons/tb"

export default function Devices() {

    const getActiveSessions = authStore((state) => state.getActiveSessions)
    const isGettingActiveSessions = authStore((state) => state.isGettingActiveSessions)
    const activeSessions = authStore((state) => state.activeSessions)

    async function fetchActiveSessions() {
        const res = await getActiveSessions()

        if (!res.success) {
            toast.error(res.message)
            return
        }
    }

    return (
        <div className="px-5 pb-5 max-w-2xl">
            <div className="flex flex-col bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-4">

                {/* header */}
                <div>
                    <span className="text-text text-[15px] font-bold">Active Sessions</span>
                    <p className="text-[13px] text-text-sm">All devices currently signed in to your account</p>
                </div>

                <hr className="border border-border/70" />

                <button
                    className="flex self-end items-center gap-1 px-3 py-1.5 rounded-lg text-[13px] border-[1.5px] font-semibold  border-overdue-border bg-overdue-bg text-overdue cursor-pointer"
                    type="button"
                >
                    <TbPower size={15} /> Sign Out From All The Devices
                </button>

                {!activeSessions ?
                    <div className="flex flex-col justify-center items-center gap-3">

                        <div className="flex justify-center items-center bg-navy-50 h-14 w-14 rounded-[14px] text-2xl">💻</div>

                        <div>
                            <p className="text-text-sm text-[13.5px] text-center">Fetch all active sessions across your devices.
                            </p>
                            <p className="text-text-sm text-[13.5px] text-center max-w-72">
                                You can sign out any session remotely.</p>
                        </div>

                        <button
                            onClick={fetchActiveSessions}
                            disabled={isGettingActiveSessions}
                            type="button"
                            className="bg-navy-700 text-card hover:bg-navy-700/90 rounded-lg px-5 py-2.5 w-full text-[14px] font-bold cursor-pointer disabled:opacity-50 disabled:pointer-events-none">
                            Load Active Sessions
                        </button>
                    </div>
                    :
                    <div className="space-y-2">
                        {activeSessions.map((session) => {
                            const isCurrentSession = session.currentSession
                            return (
                                <div
                                    key={session.sessionId}
                                    className={`flex justify-between items-center px-5 py-3 border-[1.5px] rounded-lg ${isCurrentSession ? "bg-navy-50 border-navy-700" : "bg-card border-border"}`}
                                >

                                    {/* device details */}
                                    <div className="flex flex-col">
                                        <div className="flex flex-col sm:flex-row items-center gap-2">
                                            <span className="text-text font-semibold text-sm">{session.deviceName}</span>
                                            {isCurrentSession &&
                                                <div className="flex self-start justify-center items-center gap-1 border border-paid rounded-full px-3 py-1">
                                                    <span className="bg-paid w-1.5 h-1.5 rounded-full" />
                                                    <span className="text-paid font-bold text-[10px]">This Device</span>
                                                </div>
                                            }
                                        </div>

                                        <div>
                                            <span className="text-xs text-text-sm">
                                                Last Active:</span> <span className="text-text-sm text-xs font-bold">{isCurrentSession ? "just now" : formatTimeAgo(session.lastUsedAt)}</span>
                                        </div>
                                    </div>

                                    {/* sign out button */}
                                    <button
                                        className="px-3 py-1 rounded-lg text-[13px] border-[1.5px] font-semibold shrink-0 min-w-20 border-overdue-border bg-overdue-bg text-overdue cursor-pointer"
                                        type="button"
                                    >
                                        Sign Out
                                    </button>

                                </div>
                            )
                        })}

                        <div className="flex justify-between items-center text-[13px] text-text-sm">

                            <span>{activeSessions.length} sessions</span>

                            <button
                                onClick={fetchActiveSessions}
                                disabled={isGettingActiveSessions}
                                type="button"
                                className="flex items-center gap-1 text-navy-700 text-[13px] font-bold cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                            >
                                <TbRefresh /> {isGettingActiveSessions ? "Refreshing..." : "Refresh"}
                            </button>
                        </div>

                    </div>
                }

            </div>
        </div>
    )
}