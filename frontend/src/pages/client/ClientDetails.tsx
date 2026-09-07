import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import clientStore from "../../store/clientStore"
import toast from "react-hot-toast"
import Header from "../../components/ui/Header"
import ActionButtons from "../../components/client/overview/ActionButtons"
import OverviewDetails from "../../components/client/overview/OverviewDetails"
import ClientOverviewSkeleton from "../../components/loading/client/ClientOverviewSkeleton"

export default function ClientDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const getClientOverview = clientStore((state) => state.getClientOverview)
    const isGettingClientOverview = clientStore((state) => state.isGettingClientOverview)
    const clearClientOverviewData = clientStore((state) => state.clearClientOverviewData)
    const clientOverviewData = clientStore((state) => state.clientOverviewData)

    useEffect(() => {
        async function fetchClientOverview() {
            if (!id) {
                return navigate("/clients")
            }

            const res = await getClientOverview(id)

            if (!res.success) {
                navigate("/clients", { replace: true })
                toast.error(res.message)
                return
            }
        }

        fetchClientOverview()

        return (() => {
            clearClientOverviewData()
        })
    }, [id])

    return (
        <main className="space-y-5">
            <Header header="Clients" />

            {isGettingClientOverview || !clientOverviewData ?
                <ClientOverviewSkeleton />
                :
                <>
                    <ActionButtons />
                    <OverviewDetails />
                </>
            }

        </main>
    )
}