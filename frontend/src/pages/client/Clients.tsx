import InputAndFilters from "../../components/client/InputAndFilters";
import Header from "../../components/ui/Header";
import PageHeader from "../../components/ui/PageHeader";
import { TbPlus } from "react-icons/tb";

export default function Clients() {
  return (
    <main className="bg-page min-h-screen">

      <Header header="Clients" />
      <PageHeader title="Clients" buttonText="New Client" subtitle="5 clients" icon={TbPlus} onClick={() => { }} />

      <InputAndFilters />
    </main>
  )
}
