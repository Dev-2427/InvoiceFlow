import { TbPlus } from "react-icons/tb";
import Header from "../../components/ui/Header";
import PageHeader from "../../components/ui/PageHeader";
import { useNavigate } from "react-router-dom";
import InputAndFilters from "../../components/invoice/InputAndFilters";
import { useEffect, useState } from "react";
import invoiceStore from "../../store/invoiceStore";
import toast from "react-hot-toast";

export default function Invoice() {

    const navigate = useNavigate()

    const invoiceSearch = invoiceStore((state) => state.invoiceSearch)
    const getInvoices = invoiceStore((state) => state.getInvoices)
    const isGettingInvoices = invoiceStore((state) => state.isGettingInvoices)
    const invoiceSort = invoiceStore((state) => state.invoiceSort)
    const invoiceFilter = invoiceStore((state) => state.invoiceFilter)
    const invoices = invoiceStore((state) => state.invoices)

    const [debounceSearch, setDebounceSearch] = useState(invoiceSearch)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(invoiceSearch)
        }, 500)

        return () => {
            clearTimeout(timer)
        }
    }, [invoiceSearch])

    useEffect(() => {
        // emptySelectedClientsIds()

        async function fetchInvoices() {
            const res = await getInvoices(1)

            if (!res.success) {
                toast.error(res.message)
                return
            }
        }
        fetchInvoices()
    }, [debounceSearch, invoiceSort, invoiceFilter])

    return (
        <main className="space-y-5">
            <Header header="Invoices" />

            <PageHeader title="Invoices" subtitle={`${invoices?.pagination.totalItems}   Invoices`} buttonText="Create Invoice" icon={TbPlus} onClick={() => { navigate("/invoices/new") }} />

            <InputAndFilters />

        </main>
    )
}
