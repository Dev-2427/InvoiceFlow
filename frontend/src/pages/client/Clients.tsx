import InputAndFilters from "../../components/client/InputAndFilters";
import Header from "../../components/ui/Header";
import PageHeader from "../../components/ui/PageHeader";
import { TbPlus } from "react-icons/tb";
import clientStore from "../../store/clientStore";
import ClientsList from "../../components/client/ClientsList";
import SelectedClientsAction from "../../components/client/SelectedClientsAction";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Clients() {

  const clients = clientStore((state) => state.clients)
  const selectedClientIds = clientStore((state) => state.selectedClientIds)
  const getClients = clientStore((state) => state.getClients)
  const clientSearch = clientStore((state) => state.clientSearch)
  const clientSort = clientStore((state) => state.clientSort)
  const clientFilter = clientStore((state) => state.clientFilter)
  const emptySelectedClientsIds = clientStore((state) => state.emptySelectedClientsIds)

  const [debounceSearch, setDebounceSearch] = useState(clientSearch)

  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(clientSearch)
    }, 500);

    return () => {
      clearTimeout(timer)
    }
  }, [clientSearch])


  useEffect(() => {
    emptySelectedClientsIds()

    async function fetchClients() {
      const res = await getClients(1)

      if (!res.success) {
        toast.error(res.message)
        return
      }
    }

    fetchClients()

  }, [debounceSearch, clientSort, clientFilter])

  return (
    <main className="min-h-screen space-y-4">

      <Header header="Clients" />
      <PageHeader title="Clients" buttonText="New Client" subtitle={`${clients?.pagination.totalItems ?? 0} clients`} icon={TbPlus} onClick={() => {navigate("/clients/new") }} />

      <InputAndFilters />

      {selectedClientIds.length > 0 &&
        <SelectedClientsAction />
      }

      <ClientsList />


    </main>
  )
}