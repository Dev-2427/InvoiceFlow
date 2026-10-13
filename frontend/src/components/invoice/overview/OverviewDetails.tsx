import invoiceStore from "../../../store/invoiceStore"
import organizationStore from "../../../store/organizationStore"
import formatLocalDate from "../../../utils/dateUtils"
import { formatCurrency } from "../../../utils/formatCurrency"

export default function OverviewDetails() {

  const organization = organizationStore((state) => state.organization)
  const invoiceOverviewData = invoiceStore((state) => state.invoiceOverviewData)

  const status = invoiceOverviewData?.status

  if (!invoiceOverviewData) {
    return null
  }

  const currencySymbol = invoiceOverviewData.currency.symbol

  return (
    <div className="flex flex-col gap-5 border-[1.5px] border-border lg:w-2xl w-full mx-auto rounded-[14px] bg-card p-6">

      <div className="flex justify-between">

        <div className="grid grid-cols-1 gap-3">

          {/* logo */}
          {invoiceOverviewData.showLogo &&
            <>
              < div className="flex items-center gap-2">
                {organization?.logo?.url ?
                  <img
                    src={organization.logo.url}
                    className="w-8 h-8 rounded-lg object-cover"
                    alt={`${organization.organizationName} logo`}
                  />
                  :
                  <div className="flex justify-center items-center w-8 h-8 rounded-lg bg-gold text-gold-dark font-bold">
                    {organization?.organizationName.charAt(0).toUpperCase()}
                  </div>
                }

                <p className="text-text font-extrabold text-lg capitalize">{organization?.organizationName}</p>

              </div>
            </>
          }

          {/* address */}
          <div className="text-xs text-text-sm">
            <p>{organization?.address.street1}, {organization?.address.street2}</p>
            <p>{organization?.address.city} {organization?.address.pincode}, {organization?.address.state}, {organization?.address.country} </p>
            <p className="mt-1">{organization?.email}</p>
          </div>

        </div>


        <div className="grid grid-cols-1 gap-3">

          <span className="text-navy-700 font-extrabold text-2xl text-end">{invoiceOverviewData?.invoiceNumber}</span>

          {/* invoice status */}
          <div
            className={`flex justify-self-end items-center  gap-1 border ${status === "overdue" ? "border-overdue-border bg-overdue-bg" : status === "paid" ? "border-paid-border bg-paid-bg" : status === "unpaid" ? "border-unpaid-border bg-unpaid-bg" : "border-draft-border bg-draft-bg"} rounded-[14px] px-2 py-1 w-fit`}>

            <div className={`${status === "overdue" ? "bg-overdue" : status === "paid" ? "bg-paid" : status === "unpaid" ? "bg-unpaid" : "bg-draft"} w-1.5 h-1.5 rounded-full`} />

            <span
              className={`${status === "overdue" ? "text-overdue" : status === "paid" ? "text-paid" : status === "unpaid" ? "text-unpaid" : "text-draft"} text-[11px] font-bold capitalize`}
            >{status}</span>
          </div>

          {/* issue date and due date */}
          <div className="text-xs self-end text-end">
            <p className="text-text-sm">
              <span>Issued:</span> <span>{formatLocalDate(invoiceOverviewData.issueDate)}</span>
            </p>
            <p className={`${invoiceOverviewData.status === "overdue" ? "text-overdue font-bold" : "text-text-sm"}`}>
              <span>Due:</span> <span>{formatLocalDate(invoiceOverviewData.dueDate)}</span>
            </p>
          </div>

        </div>

      </div>

      {/* bill to */}
      <div className="space-y-0.5 bg-page rounded-lg px-5 py-3">
        <p className="text-text-sm text-xs  font-semibold">BILL TO</p>
        <p className="text-text font-bold text-[16px] capitalize">{invoiceOverviewData.client.displayName}</p>
        <p className="text-text-sm text-[13px]">{invoiceOverviewData.client.companyName}</p>
      </div>


      {/* payment details */}
      {invoiceOverviewData.status === "paid" &&
        <div className="space-y-2 bg-paid-bg border border-paid-border rounded-lg px-5 py-3">
          <p className="text-paid text-xs  font-bold">PAYMENT RECEIVED</p>

          <div className="flex gap-5">

            <div className="flex flex-col">
              <span className="text-text-sm text-[13px]">Date</span>
              <span className="text-text text-[13px] font-bold">{formatLocalDate(invoiceOverviewData.payment.receivedDate!)}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-text-sm text-[13px]">Mode</span>
              <span className="text-text text-[13px] font-bold uppercase">{invoiceOverviewData.payment.mode}</span>

            </div>
            <div className="flex flex-col">
              <span className="text-text-sm text-[13px]">Amount</span>
              <span className="text-paid text-[13px] font-bold">{invoiceOverviewData.currency.symbol}{formatCurrency(invoiceOverviewData.payment.amount!)}</span>
            </div>

          </div>
        </div>
      }


      {/* line items */}
      <div>
        <div className="flex justify-between items-center border-b-2 border-border text-[12px] text-text-sm font-bold pb-2">

          <span className="flex-1">DESCRIPTION</span>

          <div className="flex">
            <span className="w-28 text-end">QTY</span>
            <span className="w-28 text-end">RATE</span>
            <span className="w-28 text-end">AMOUNT</span>
          </div>
        </div>

        {invoiceOverviewData.lineItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center border-b border-border text-[13px] font-semibold py-2.5">
            <span className="flex-1 text-text">{item.description}</span>

            <div className="flex">
              <span className="w-28 text-end text-text-sm">{item.quantity}</span>
              <span className="w-28 text-end text-text-sm">{currencySymbol}{formatCurrency(item.rate)}</span>
              <span className="w-28 text-end text-text">{currencySymbol}{formatCurrency(item.amount)}</span>
            </div>
          </div>
        ))}

      </div>

      {/* calculations */}
      <div className="self-end min-w-44">

        <div className="flex justify-between text-text-sm text-sm">
          <span>Subtotal</span>
          <span>{currencySymbol}{formatCurrency(invoiceOverviewData.subtotal)}</span>
        </div>

        <div className="flex justify-between text-paid text-sm">
          <span>Discount ({invoiceOverviewData.discountValue}%)</span>
          <span>-{currencySymbol}{formatCurrency(invoiceOverviewData.discountAmount)}</span>
        </div>

        <div className="flex justify-between text-text-sm text-sm">
          <span>GST / TAX ({invoiceOverviewData.taxValue}%)</span>
          <span>+{currencySymbol}{formatCurrency(invoiceOverviewData.taxAmount)}</span>
        </div>

        <hr className="border-[1.5px] border-border mt-1.5 mb-2" />

        <div className="flex justify-between text-navy-700 text-[16px] font-bold">
          <span>Total</span>
          <span>{currencySymbol}{formatCurrency(invoiceOverviewData.totalAmount)}</span>
        </div>

      </div>

      <hr className="border border-border" />

      {/* notes */}
      <div>
        <span className="font-semibold text-text-sm text-[11px]">NOTES</span>
        <p className="text-sm text-text-md">{invoiceOverviewData.notes.trim() ? invoiceOverviewData.notes : "_"}</p>
      </div>

      <hr className="border border-border" />


      {/* signature */}
      <div className="w-42 self-end text-center">

        <hr className="border border-text mt-12" />
        <span className="text-xs text-text-sm font-semibold ">Authorised Signature</span>
        <p className="text-text-xs text-[10px]">Thank you for your business</p>

      </div>

    </div >
  )
}