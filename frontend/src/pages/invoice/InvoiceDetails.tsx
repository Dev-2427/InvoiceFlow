import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/ui/Header";
import { useEffect } from "react";
import invoiceStore from "../../store/invoiceStore";
import toast from "react-hot-toast";
import ActionButtons from "../../components/invoice/overview/ActionButtons";
import OverviewDetails from "../../components/invoice/overview/OverviewDetails";
import InvoiceOverviewSkeleton from "../../components/loading/invoice/InvoiceOverviewSkeleton";

export default function InvoiceDetails() {

  const navigate = useNavigate()
  const { invoiceId } = useParams()

  const getInvoiceOverviewData = invoiceStore((state) => state.getInvoiceOverviewData)
  const clearInvoiceOverviewData = invoiceStore((state) => state.clearInvoiceOverviewData)
  const isGettingInvoiceOverviewData = invoiceStore((state) => state.isGettingInvoiceOverviewData)

  useEffect(() => {

    async function fetchInvoiceDetails() {

      if (!invoiceId) {
        navigate("/invoices")
        return
      }

      const res = await getInvoiceOverviewData(invoiceId)

      if (!res.success) {
        navigate("/invoices")
        toast.error(res.message)
        return
      }
    }

    fetchInvoiceDetails()

    return (() => {
      clearInvoiceOverviewData()
    })

  }, [invoiceId])

  return (
    <main className="space-y-5">

      <Header header="Invoices" />
      {isGettingInvoiceOverviewData ?
        <InvoiceOverviewSkeleton />
        :
        <>
          <ActionButtons />

          <div className="px-5 pb-5">
            <OverviewDetails />
          </div>
        </>

      }

    </main>
  )
}
