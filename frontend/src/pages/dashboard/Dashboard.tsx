import { useEffect } from "react";
import Header from "../../components/ui/Header";
import dashboardStore from "../../store/dashboardStore";
import toast from "react-hot-toast";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import organizationStore from "../../store/organizationStore";
import Overview from "../../components/dashboard/Overview";
import RevenueAndReceipts from "../../components/dashboard/RevenueAndReceipts";

export default function Dashboard() {

    const getDashboardData = dashboardStore((store) => store.getDashboardData)
    const isGettingDashboardData = dashboardStore((store) => store.isGettingDashboardData)
    const dashboardData = dashboardStore((store) => store.dashboardData)
    const revenueAndReceiptsData = dashboardStore((store) => store.revenueAndReceiptsData)
    const isGettingRevenueAndReceiptsData = dashboardStore((store) => store.isGettingRevenueAndReceiptsData)

    const organization = organizationStore((store) => store.organization)

    useEffect(() => {
        async function fetchDashboardData() {
            const res = await getDashboardData()

            if (!res.success) {
                toast.error(res.message)
                return
            }
        }

        fetchDashboardData()
    }, [])

    return (
        <>
            <Header header="Dashboard" />


            {isGettingDashboardData ?
                <div>
                    Loading
                </div>
                :
                !dashboardData ?
                    <div>
                        Show Error Code
                    </div>
                    :
                    <div className="space-y-5 mb-4">
                        <DashboardHeader
                            organizationName={organization?.organizationName!}
                        />

                        <Overview
                            clientOverviewData={dashboardData.clientOverviewData}
                            currencySymbol={organization?.currency.symbol!}
                        />

                        {isGettingRevenueAndReceiptsData ?
                            <div>
                                Loading
                            </div>
                            :
                            <>
                                {revenueAndReceiptsData &&
                                    <RevenueAndReceipts
                                        revenueAndReceiptsData={revenueAndReceiptsData}
                                        currencySymbol={organization?.currency.symbol!}
                                    />
                                }
                            </>
                        }

                    </div>
            }
        </>
    )
}
