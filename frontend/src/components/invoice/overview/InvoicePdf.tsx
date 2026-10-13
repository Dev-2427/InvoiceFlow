import React from "react"

import invoiceStore from "../../../store/invoiceStore"
import organizationStore from "../../../store/organizationStore"

import formatLocalDate from "../../../utils/dateUtils"
import { formatCurrency } from "../../../utils/formatCurrency"

interface InvoicePdfProps {
    invoiceRef: React.RefObject<HTMLDivElement | null>
}

export default function InvoicePdf({ invoiceRef }: InvoicePdfProps) {
    const organization = organizationStore((state) => state.organization)
    const invoiceOverviewData = invoiceStore(
        (state) => state.invoiceOverviewData
    )

    if (!invoiceOverviewData) {
        return null
    }

    const {
        status,
        currency,
        invoiceNumber,
        issueDate,
        dueDate,
        client,
        lineItems,
        subtotal,
        discountValue,
        discountAmount,
        taxValue,
        taxAmount,
        totalAmount,
        notes,
        payment,
        showLogo
    } = invoiceOverviewData

    const currencySymbol = currency.symbol

    const statusColors = {
        paid: {
            text: "#198754",
            bg: "#E9F8F0",
            border: "#A8E5C6"
        },
        unpaid: {
            text: "#D97706",
            bg: "#FFF7E6",
            border: "#F5D08A"
        },
        overdue: {
            text: "#DC2626",
            bg: "#FDECEC",
            border: "#F3B5B5"
        },
        draft: {
            text: "#6B7280",
            bg: "#F3F4F6",
            border: "#D1D5DB"
        }
    }[status]

    return (
        <div
            ref={invoiceRef}
            className="w-179.5 box-border bg-white text-text px-8 py-10"
        >
            <div className="flex flex-col gap-6">

                {/* top section */}
                <div className="flex justify-between">

                    {/* organization */}
                    <div className="flex flex-col gap-3 max-w-97.5">

                        {showLogo && (
                            <div className="flex items-center h-9 gap-2">
                                {organization?.logo?.url ? (
                                    <img
                                        src={organization.logo.url}
                                        alt={`${organization.organizationName} logo`}
                                        className="w-9 h-9 rounded-lg object-cover"
                                        crossOrigin="anonymous"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-lg bg-gold shrink-0">
                                        <svg
                                            width="36"
                                            height="36"
                                            viewBox="0 0 36 36"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="text-gold-dark"
                                        >
                                            <text
                                                x="18"
                                                y="18"
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                fill="currentColor"
                                                fontSize="16"
                                                fontWeight="700"
                                            >
                                                {organization?.organizationName.charAt(0).toUpperCase()}
                                            </text>
                                        </svg>
                                    </div>
                                )}

                                <svg
                                    width="180"
                                    height="36"
                                    viewBox="0 0 180 36"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <text
                                        x="0"
                                        y="18"
                                        dominantBaseline="central"
                                        fill="currentColor"
                                        fontSize="20"
                                        fontWeight="800"
                                        className="text-text capitalize"
                                    >
                                        {organization?.organizationName}
                                    </text>
                                </svg>
                            </div>
                        )}

                        <div className="text-xs text-text-sm leading-5">
                            <p>
                                {organization?.address.street1}
                                {organization?.address.street2 &&
                                    `, ${organization.address.street2}`}
                            </p>

                            <p>
                                {organization?.address.city}{" "}
                                {organization?.address.pincode},{" "}
                                {organization?.address.state},{" "}
                                {organization?.address.country}
                            </p>

                            <p className="mt-1">
                                {organization?.email}
                            </p>
                        </div>

                    </div>

                    {/* invoice information */}
                    <div className="flex flex-col items-end gap-4">

                        <span className="text-navy-700 font-extrabold text-3xl">
                            {invoiceNumber}
                        </span>

                        {/* status */}
                        <div
                            className="rounded-full overflow-hidden"
                            style={{
                                backgroundColor: statusColors.bg,
                                border: `1px solid ${statusColors.border}`
                            }}
                        >
                            <svg
                                width={status === "overdue" ? 72 : status === "unpaid" ? 66 : 54}
                                height="28"
                                viewBox={`0 0 ${status === "overdue" ? 72 : status === "unpaid" ? 66 : 54} 28`}
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    cx="9"
                                    cy="14"
                                    r="3"
                                    fill={statusColors.text}
                                />

                                <text
                                    x="17"
                                    y="14"
                                    dominantBaseline="central"
                                    fill={statusColors.text}
                                    fontSize="12"
                                    fontWeight="700"
                                >
                                    {status}
                                </text>
                            </svg>
                        </div>

                        {/* dates */}
                        <div className="text-xs text-text-sm text-end leading-5">
                            <p>
                                <span>Issued: </span>
                                <span>
                                    {formatLocalDate(issueDate)}
                                </span>
                            </p>

                            <p
                                className={
                                    status === "overdue"
                                        ? "text-overdue font-bold"
                                        : "text-text-sm"
                                }
                            >
                                <span>Due: </span>
                                <span>
                                    {formatLocalDate(dueDate)}
                                </span>
                            </p>
                        </div>

                    </div>

                </div>

                {/* bill to */}
                <div className="bg-page rounded-lg px-5 py-3.5 break-inside-avoid">
                    <p className="text-text-sm text-xs font-semibold">
                        BILL TO
                    </p>

                    <p className="text-text font-bold text-lg mt-1 capitalize">
                        {client.displayName}
                    </p>

                    {client.companyName && (
                        <p className="text-text-sm text-sm">
                            {client.companyName}
                        </p>
                    )}
                </div>

                {/* payment details */}
                {status === "paid" && (
                    <div className="bg-paid-bg border border-paid-border rounded-lg px-5 py-4 break-inside-avoid">

                        <p className="text-paid text-xs font-bold mb-3">
                            PAYMENT RECEIVED
                        </p>

                        <div className="flex gap-12">

                            <div className="flex flex-col gap-1">
                                <span className="text-text-sm text-xs">
                                    Date
                                </span>

                                <span className="text-text text-sm font-bold">
                                    {formatLocalDate(payment.receivedDate!)}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-text-sm text-xs">
                                    Mode
                                </span>

                                <span className="text-text text-sm font-bold uppercase">
                                    {payment.mode}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-text-sm text-xs">
                                    Amount
                                </span>

                                <span className="text-paid text-sm font-bold">
                                    {currencySymbol}
                                    {formatCurrency(payment.amount!)}
                                </span>
                            </div>

                        </div>
                    </div>
                )}

                {/* line items */}
                <div>

                    {/* header */}
                    <div className="flex items-center border-b border-border pb-3 text-xs text-text-sm font-bold">
                        <span className="flex-1">
                            DESCRIPTION
                        </span>

                        <div className="flex">
                            <span className="w-28 text-end">
                                QTY
                            </span>

                            <span className="w-28 text-end">
                                RATE
                            </span>

                            <span className="w-28 text-end">
                                AMOUNT
                            </span>
                        </div>
                    </div>

                    {/* rows */}
                    {lineItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center border-b border-border py-3.5 text-sm break-inside-avoid"
                        >
                            <span className="flex-1 text-text pr-4">
                                {item.description}
                            </span>

                            <div className="flex">
                                <span className="w-28 text-end text-text-sm">
                                    {item.quantity}
                                </span>

                                <span className="w-28 text-end text-text-sm">
                                    {currencySymbol}
                                    {formatCurrency(item.rate)}
                                </span>

                                <span className="w-28 text-end text-text font-semibold">
                                    {currencySymbol}
                                    {formatCurrency(item.amount)}
                                </span>
                            </div>
                        </div>
                    ))}

                </div>

                {/* calculations */}
                <div className="self-end w-64 break-inside-avoid">

                    <div className="flex justify-between text-text-sm text-sm py-0.5">
                        <span>Subtotal</span>

                        <span>
                            {currencySymbol}
                            {formatCurrency(subtotal)}
                        </span>
                    </div>

                    <div className="flex justify-between text-paid text-sm py-0.5">
                        <span>
                            Discount ({discountValue}%)
                        </span>

                        <span>
                            -{currencySymbol}
                            {formatCurrency(discountAmount)}
                        </span>
                    </div>

                    <div className="flex justify-between text-text-sm text-sm py-0.5">
                        <span>
                            GST / TAX ({taxValue}%)
                        </span>

                        <span>
                            +{currencySymbol}
                            {formatCurrency(taxAmount)}
                        </span>
                    </div>

                    <hr className="border border-border mt-2 mb-3" />

                    <div className="flex justify-between text-navy-700 text-lg font-bold">
                        <span>Total</span>

                        <span>
                            {currencySymbol}
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>

                </div>

                <hr className="border-border" />

                {/* notes */}
                <div className="break-inside-avoid">

                    <span className="font-semibold text-text-sm text-xs">
                        NOTES
                    </span>

                    <p className="text-sm text-text-md mt-1 whitespace-pre-wrap">
                        {notes.trim() ? notes : "_"}
                    </p>

                </div>

                <hr className="border-border" />

                {/* signature */}
                <div className="w-44 self-end text-center break-inside-avoid">

                    <div className="border-t border-text mt-12" />

                    <span className="text-xs text-text-sm font-semibold">
                        Authorised Signature
                    </span>

                    <p className="text-text-xs text-[10px] mt-1">
                        Thank you for your business
                    </p>

                </div>

            </div>
        </div>
    )
}