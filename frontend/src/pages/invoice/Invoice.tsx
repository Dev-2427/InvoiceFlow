import { TbPlus } from "react-icons/tb";
import Header from "../../components/ui/Header";
import PageHeader from "../../components/ui/PageHeader";
import { useNavigate } from "react-router-dom";

export default function Invoice() {

    const navigate = useNavigate()

    return (
        <main className="space-y-5">
            <Header header="Invoices" />

            <PageHeader title="Invoices" subtitle="5 Invoices" buttonText="Create Invoice" icon={TbPlus} onClick={() => { navigate("/invoices/new")}} />

        </main>
    )
}
