import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import clientStore from "../../store/clientStore"
import toast from "react-hot-toast"
import Header from "../../components/ui/Header"
import ActionButtons from "../../components/client/overview/ActionButtons"

export default function ClientDetails() {

    const { id } = useParams()

    const navigate = useNavigate()

    const getClientOverview = clientStore((state) => state.getClientOverview)

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
    }, [])


    return (
        <main className="space-y-5">
            <Header header="Clients" />

            <ActionButtons />
        </main>
    )
}
