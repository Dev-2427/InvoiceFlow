
import toast from "react-hot-toast"
import ReportData from "../../components/reports/ReportData"
import ReportForm from "../../components/reports/ReportForm"
import Header from "../../components/ui/Header"
import organizationStore from "../../store/organizationStore"
import reportsStore from "../../store/reportsStore"
import type { GetReportsSchemaInput } from "../../validation/reportsValidation"

function Reports() {

    const reports = reportsStore((state) => state.reports)
    const getReports = reportsStore((state) => state.getReports)
    const lastFetchedFilterData = reportsStore((state) => state.lastFetchedFilterData)

    const organization = organizationStore((state) => state.organization)

    async function fetchReportData(data: GetReportsSchemaInput, page: number) {
        const res = await getReports(data, page)

        if (!res.success) {
            toast.error(res.message)
            return
        }
    }

    return (
        <main className="space-y-5">
            <Header header="Reports" />

            {/* PageHeader */}
            <div className="px-5 lg:pt-4">

                <span className="text-text text-[22px] font-bold">Reports</span>

                <p className="text-[14px] text-text-sm">Set filters and fetch your financial report</p>
            </div>

            {/* filter form */}
            <ReportForm
                onSubmit={(data) => fetchReportData(data, 1)}
            />

            {/* filter data */}
            <ReportData
                reportData={reports}
                currency={organization?.currency!}
                changePage={(page) => fetchReportData(lastFetchedFilterData, page)}
            />
        </main>
    )
}

export default Reports
