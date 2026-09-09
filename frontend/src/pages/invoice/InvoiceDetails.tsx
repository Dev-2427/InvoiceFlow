import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/ui/Header";
import { useEffect, useRef } from "react";
import invoiceStore from "../../store/invoiceStore";
import toast from "react-hot-toast";
import ActionButtons from "../../components/invoice/overview/ActionButtons";
import OverviewDetails from "../../components/invoice/overview/OverviewDetails";
import InvoiceOverviewSkeleton from "../../components/loading/invoice/InvoiceOverviewSkeleton";
import html2pdf from "html2pdf.js"
import InvoicePdf from "../../components/invoice/overview/InvoicePdf";

export default function InvoiceDetails() {

  const navigate = useNavigate()
  const { invoiceId } = useParams()

  const invoiceRef = useRef<HTMLDivElement>(null)

  const getInvoiceOverviewData = invoiceStore((state) => state.getInvoiceOverviewData)
  const clearInvoiceOverviewData = invoiceStore((state) => state.clearInvoiceOverviewData)
  const isGettingInvoiceOverviewData = invoiceStore((state) => state.isGettingInvoiceOverviewData)
  const invoiceOverviewData = invoiceStore((state) => state.invoiceOverviewData)

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

  async function handleDownloadPdf() {
    if (!invoiceRef.current || !invoiceOverviewData) return

  const options = {
    margin: 10,
    filename: `${invoiceOverviewData.invoiceNumber}.pdf`,
    image: {
        type: "jpeg" as const,
        quality: 0.98
    },
    html2canvas: {
        scale: 2,
        useCORS: true
    },
    jsPDF: {
        unit: "mm" as const,
        format: "a4" as const,
        orientation: "portrait" as const
    },
    pagebreak: {
        mode: ["css", "legacy"] as const
    }
}

    await html2pdf()
        .set(options)
        .from(invoiceRef.current)
        .save()
}

  return (
    <main className="space-y-5">

      <Header header="Invoices" />
      {isGettingInvoiceOverviewData ?
        <InvoiceOverviewSkeleton />
        :
        <>
          <ActionButtons onDownloadPdf={handleDownloadPdf} />

          <div className="px-5 pb-5">
            <OverviewDetails />
          </div>

          <div className="absolute left-[-9999px] top-0">
            <InvoicePdf invoiceRef={invoiceRef} />
          </div>
        </>

      }

    </main>
  )
}
