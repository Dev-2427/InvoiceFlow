import { TbPlus, TbXFilled } from "react-icons/tb";
import Header from "../../components/ui/Header";
import { useNavigate } from "react-router-dom";
import clientStore from "../../store/clientStore";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { HiChevronDown, HiUser } from "react-icons/hi2";
import SearchedClientList from "../../components/invoice/SearchedClientList";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoiceSchema, type CreateInvoiceInput } from "../../validation/invoice.validation";
import ClientDetailsMenu from "../../components/invoice/ClientDetailsMenu";
import organizationStore from "../../store/organizationStore";
import "react-day-picker/style.css"
import DatePicker from "../../components/ui/DatePicker";
import { formatCurrency } from "../../utils/formatCurrency";
import PaymentModeMenu from "../../components/invoice/PaymentModeMenu";
import invoiceStore from "../../store/invoiceStore";

export default function CreateInvoice() {

    const navigate = useNavigate()

    const setClientSearchString = clientStore((state) => state.setClientSearchString)
    const clientSearchString = clientStore((state) => state.clientSearchString)
    const searchClient = clientStore((state) => state.searchClient)
    const searchedClients = clientStore((state) => state.searchedClients)
    const selectedClient = clientStore((state) => state.selectedClient)

    const organization = organizationStore((state) => state.organization)

    const creatingInvoice = invoiceStore((state) => state.creatingInvoice)
    const createInvoice = invoiceStore((state) => state.createInvoice)

    const [showSelectedClientDatails, setShowSelectedClientDatails] = useState(false)
    const [isPaid, setIsPaid] = useState(false)
    const [showPaymentModeMenu, setShowPaymentModeMenu] = useState(false)
    const [openDatePicker, setOpenDatePicker] = useState<"issue" | "due" | "payment" | null>(null)
    const [loadingType, setLoadingType] = useState<"drafting" | "creating" | null>(null)

    const menuRef = useRef<HTMLDivElement>(null)


    const { handleSubmit, control, register, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(createInvoiceSchema),
        defaultValues: {
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            lineItems: [{ description: "", quantity: 1, rate: 0 }],
            status: "unpaid",
            discountValue: 10,
            taxValue: 18,
            payment: { mode: null, receivedDate: null, amount: null, note: "" },
            notes: ""
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "lineItems"
    })

    const issueDate = watch("issueDate") as Date
    const dueDate = watch("dueDate") as Date
    const discount = watch("discountValue") || 0
    const tax = watch("taxValue") || 0
    const lineItems = watch("lineItems")
    const paymentMode = watch("payment.mode")
    const paymentReceivedDate = watch("payment.receivedDate") as Date

    const subtotal = lineItems.reduce((total, item) => (
        total = total + (item.quantity || 0) * (item.rate || 0)
    ), 0)

    const discountAmount = subtotal * (discount / 100)
    const taxAmount = (subtotal - discountAmount) * (tax / 100)
    const total = subtotal - discountAmount + taxAmount

    useEffect(() => {

        if (selectedClient) return

        async function fetchSearchedClients() {

            const res = await searchClient()

            if (!res.success) {
                toast.error(res.message)
                return
            }
        }

        const searchTimeout = setTimeout(() => {
            fetchSearchedClients()
        }, 300)

        return (() => {
            clearTimeout(searchTimeout)
        })
    }, [clientSearchString])

    useEffect(() => {
        if (isPaid) {
            setValue("status", "paid", { shouldValidate: true })

            if (!paymentMode) {
                setValue("payment.mode", "cash", { shouldValidate: true })
            }

            if (!paymentReceivedDate) {
                setValue("payment.receivedDate", new Date(), { shouldValidate: true })
            }
        } else {
            setValue("status", "unpaid", { shouldValidate: true })
            setValue("payment", {
                amount: null,
                mode: null,
                note: "",
                receivedDate: null
            }, { shouldValidate: true })
        }
    }, [isPaid, total])

    useEffect(() => {
        function handleMenuClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setShowPaymentModeMenu(false)
            }
        }

        document.addEventListener("mousedown", handleMenuClick)

        return (() => {
            document.removeEventListener("mousedown", handleMenuClick)
        })
    }, [])


    async function onSubmit(data: CreateInvoiceInput) {

        let payload = data

        const today = new Date().setHours(0, 0, 0, 0)
        const due = new Date(data.dueDate).setHours(0, 0, 0, 0)

        if (loadingType === "drafting") {
            payload = { ...data, status: "draft" }
        } else if (data.status !== "paid") {
            payload = { ...data, status: due <= today ? "overdue" : "unpaid" }
        }

        const res = await createInvoice(payload)

        if (!res.success) {
            setLoadingType(null)
            toast.error(res.message)
            return
        }

        setLoadingType(null)
        toast.success(res.message)
        navigate(`/invoices/${res.data.invoiceId}`)

    }

    function onInvalid() {
        setLoadingType(null)
    }

    return (
        <div className="space-y-5 mb-5">
            <Header header="Invoices" />

            <header className="flex justify-between items-center px-5 lg:pt-4">
                <span className="text-text font-bold text-[22px]">New Invoice</span>

                <button
                    onClick={() => navigate(-1)}
                    type="button"
                    className="flex justify items-center gap-1 text-text-sm text-[15px] cursor-pointer font-semibold">
                    <TbXFilled />
                    <span>Cancel</span>
                </button>
            </header>


            <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                className="space-y-5">

                {/* client & dates */}
                <div className="bg-card p-5 mx-5 rounded-[14px] space-y-2 border border-border">

                    <p className="font-bold text-text mb-4">Client & Dates</p>

                    <div className="flex flex-col md:flex-row items-start md:gap-3">

                        {/* search client */}
                        <div className="flex items-center gap-2 w-full">

                            <div className="relative flex flex-col gap-1 grow min-w-0 w-full">

                                <label
                                    htmlFor="searchClient"
                                    className="text-[11px] text-text-sm font-bold"
                                >
                                    CLIENT *
                                </label>

                                <input
                                    onChange={(e) => setClientSearchString(e.target.value)}
                                    value={clientSearchString}
                                    spellCheck={false}
                                    className="w-full border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] transition-all duration-200"
                                    placeholder="Search client..."
                                    id="searchClient"
                                />

                                <p className="min-h-5 text-xs text-overdue">
                                    {errors.clientId?.message}
                                </p>

                                {
                                    searchedClients && <SearchedClientList onClientSelect={(clientId) => {
                                        setValue("clientId", clientId, {
                                            shouldValidate: true
                                        })
                                    }} />
                                }

                            </div>


                            {
                                selectedClient &&
                                <button
                                    onClick={() => { setShowSelectedClientDatails(prev => !prev) }}
                                    type="button"
                                    className="flex justify-center items-center gap-2 border-border border-[1.5px] rounded-lg py-2.5 px-3 text-[13px] text-text cursor-pointer hover:bg-page"
                                >
                                    <HiUser />
                                    View
                                </button>
                            }

                        </div>
                    </div>


                    {/* issue date and due date */}
                    <div className="flex flex-col md:flex-row items-start md:gap-3">

                        <DatePicker
                            label="ISSUE DATE"
                            value={issueDate}
                            error={errors.issueDate?.message}
                            isOpen={openDatePicker === "issue"}
                            onOpen={() => setOpenDatePicker("issue")}
                            onClose={() => setOpenDatePicker(null)}
                            onChange={(date) => {
                                setValue("issueDate", date, {
                                    shouldValidate: true
                                })
                            }}
                        />

                        <DatePicker
                            label="DUE DATE"
                            value={dueDate}
                            error={errors.dueDate?.message}
                            isOpen={openDatePicker === "due"}
                            onOpen={() => setOpenDatePicker("due")}
                            onClose={() => setOpenDatePicker(null)}
                            onChange={(date) => {
                                setValue("dueDate", date, {
                                    shouldValidate: true
                                })
                            }}
                        />

                    </div>

                </div>

                {/* line items */}
                <div className="bg-card p-5 mx-5 rounded-[14px] space-y-2 border border-border">

                    <p className="font-bold text-text mb-4">Line Items</p>

                    {/* labels */}
                    <div className="flex items-center gap-2 w-full">
                        <div className="grow min-w-0 w-full">
                            <label className="text-[11px] text-text-sm font-bold">
                                DESCRIPTION
                            </label>
                        </div>

                        <div className="min-w-0 w-28">
                            <label className="text-[11px] text-text-sm font-bold">
                                QTY
                            </label>
                        </div>

                        <div className="min-w-0 w-42">
                            <label className="text-[11px] text-text-sm font-bold">
                                RATE
                            </label>
                        </div>


                        <div className="w-16" />
                    </div>

                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="flex items-start gap-2 w-full">

                            {/* description */}
                            <div className="flex flex-col gap-1 grow min-w-0 w-full">

                                <input
                                    {...register(`lineItems.${index}.description`)}
                                    spellCheck={false}
                                    className="w-full border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] transition-all duration-200"
                                    placeholder="Service"
                                />

                                {errors.lineItems?.[index]?.description?.message && (
                                    <p className="min-h-5 text-xs text-overdue">
                                        {errors.lineItems[index].description.message}
                                    </p>
                                )}

                            </div>

                            {/* quantity */}
                            <div className="flex flex-col gap-1 min-w-0 w-28">

                                <input
                                    {...register(`lineItems.${index}.quantity`, {
                                        valueAsNumber: true
                                    })}
                                    type="number"
                                    min={0}
                                    step={1}
                                    className="w-full border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] text-[13px]"
                                />

                                {errors.lineItems?.[index]?.quantity?.message && (
                                    <p className="min-h-5 text-xs text-overdue">
                                        {errors.lineItems[index].quantity.message}
                                    </p>
                                )}

                            </div>

                            {/* rate */}
                            <div className="flex flex-col gap-1 min-w-0 w-42">

                                <input
                                    {...register(`lineItems.${index}.rate`, {
                                        valueAsNumber: true
                                    })}
                                    type="number"
                                    min={0}
                                    className="w-full border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] text-[13px]"
                                />

                                {errors.lineItems?.[index]?.rate?.message && (
                                    <p className="min-h-5 text-xs text-overdue">
                                        {errors.lineItems[index].rate.message}
                                    </p>
                                )}

                            </div>

                            {/* remove */}
                            <button
                                onClick={() => remove(index)}
                                type="button"
                                className="flex justify-center items-center rounded-[14px] bg-overdue-bg text-overdue h-10 w-16 cursor-pointer"
                            >
                                <TbXFilled />
                            </button>

                        </div>
                    ))}

                    {/* add */}
                    <button
                        type="button"
                        onClick={() => append({
                            description: "",
                            quantity: 1,
                            rate: 0
                        })}
                        className="flex items-center gap-1 border-2 border-dashed border-border rounded-lg text-[13px] text-text font-semibold px-3 py-2 cursor-pointer hover:bg-page"
                    >
                        <TbPlus />
                        <span>Add item</span>
                    </button>

                </div>

                {/* tax and discount */}
                <div className="bg-card p-5 mx-5 rounded-[14px] space-y-5  border border-border">

                    <p className="font-bold text-text mb-4">Tax & Discount</p>


                    <div
                        className="flex flex-raw items-start md:gap-3">


                        <div className="flex items-center gap-2 w-full">

                            {/* discount */}
                            <div className="flex flex-col gap-1 grow min-w-0 w-full">

                                <label
                                    className="text-[11px] text-text-sm font-bold"
                                >
                                    DISCOUNT (%)
                                </label>

                                <input
                                    {...register("discountValue", { valueAsNumber: true })}
                                    max={100}
                                    value={discount}
                                    type="number"
                                    spellCheck={false}
                                    className="w-full border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px]  text-[13px] transition-all duration-200"
                                />


                            </div>

                            {/* tax */}
                            <div className="flex flex-col gap-1 grow min-w-0 w-full">

                                <label
                                    className="text-[11px] text-text-sm font-bold"
                                >
                                    GST / TAX (%)
                                </label>

                                <input
                                    {...register("taxValue", { valueAsNumber: true })}
                                    value={tax}
                                    max={100}
                                    type="number"
                                    spellCheck={false}
                                    className="w-full border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] text-[13px] transition-all duration-200"
                                />
                            </div>

                        </div>

                    </div>

                    {/* summary */}
                    <div className="bg-page rounded-[14px] space-y-1.5 px-5 py-3">

                        {/* Subtotal */}
                        <div className="flex justify-between items-center ">
                            <span className="text-text-sm text-[14px]">Subtotal</span>
                            <span className="text-[14px] text-text-sm">{organization?.currency.symbol} {
                                formatCurrency(subtotal)
                            }</span>
                        </div>

                        {/* discount */}
                        <div className="flex justify-between items-center ">
                            <span className="text-paid text-[14px]">Discount</span>
                            <span className="text-[14px] text-paid">-{organization?.currency.symbol}{
                                formatCurrency(discountAmount)
                            }</span>
                        </div>

                        {/* tax */}
                        <div className="flex justify-between items-center ">
                            <span className="text-text-sm text-[14px]">GST / TAX</span>
                            <span className="text-[14px] text-text-sm">+{organization?.currency.symbol}{formatCurrency(taxAmount)}</span>
                        </div>

                        <hr className="border-[1.5px] border-border w-full rounded-[14px]" />

                        {/* final total */}
                        <div className="flex justify-between items-center ">
                            <span className="text-text text-[17px] font-bold">Total</span>
                            <span className="text-[17px] text-text font-bold">{organization?.currency.symbol}{formatCurrency(total)}</span>
                        </div>

                    </div>


                </div>


                {/* notes */}
                <div className="bg-card p-5 mx-5 rounded-[14px] border border-border">

                    <p className="font-bold text-text mb-4">Notes</p>

                    <textarea
                        {...register("notes")}
                        spellCheck={false}
                        className="w-full h-22 border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] transition-all duration-200"
                        placeholder="Payment terms, thank you..."
                    />

                </div>


                {/* payment */}
                <div className={`p-5 mx-5 rounded-[14px] border-[1.5px] ${isPaid ? "border-paid-border bg-paid-bg" : "border-border bg-card"}`}>

                    <div className={`flex justify-between items-center ${isPaid && "mb-5"}`}>
                        <span className={`${isPaid ? "text-paid" : "text-text"} font-bold text-[15px]`}>Payment Already Received?</span>

                        <button
                            type="button"
                            onClick={() => setIsPaid(prev => !prev)}
                            className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${isPaid ? "bg-paid" : "bg-page"
                                }`}
                        >
                            <span
                                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isPaid ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>

                    {isPaid &&
                        <>
                            <div
                                className="flex flex-raw items-start md:gap-3">


                                <div className="flex items-center gap-2 w-full">

                                    {/* payment mode */}
                                    <div
                                        ref={menuRef}
                                        className="relative flex flex-col gap-1 min-w-0 w-1/2">

                                        <label
                                            className="text-[11px] text-text-sm font-bold"
                                        >
                                            PAYMENT MODE
                                        </label>

                                        <button
                                            onClick={() => setShowPaymentModeMenu(prev => !prev)}
                                            type="button"
                                            className="flex justify-between items-center w-full border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text text-[13px] capitalize cursor-pointer"
                                        >
                                            <span>
                                                {paymentMode || "cash"}
                                            </span>

                                            <HiChevronDown className={`${showPaymentModeMenu && "rotate-180"}`} />
                                        </button>

                                        <p className="min-h-5 text-xs text-overdue">
                                            {errors.payment?.mode?.message}
                                        </p>


                                        {/* payment mode menu */}
                                        {showPaymentModeMenu
                                            && <PaymentModeMenu
                                                onChange={(mode) => setValue("payment.mode", mode, { shouldValidate: true })}
                                                onClose={() => setShowPaymentModeMenu(false)}

                                            />
                                        }
                                    </div>

                                    {/* payment date */}
                                    <div className="w-1/2">
                                        <DatePicker
                                            onChange={(date) => {
                                                setValue("payment.receivedDate", date, {
                                                    shouldValidate: true
                                                })
                                            }}
                                            onClose={() => setOpenDatePicker(null)}
                                            isOpen={openDatePicker === "payment"}
                                            onOpen={() => setOpenDatePicker("payment")}
                                            value={paymentReceivedDate}
                                            error={errors.payment?.receivedDate?.message}
                                            label="PAYMENT DATE"
                                            directionUpLeft={true}
                                        />
                                    </div>

                                </div>

                            </div>

                            <div className="flex flex-col gap-1">
                                <label
                                    htmlFor="paymentNote"
                                    className="font-bold text-text-sm text-[11px]">NOTE</label>

                                <textarea
                                    {...register("payment.note")}
                                    spellCheck={false}
                                    id="paymentNote"
                                    className="w-full h-22 border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] transition-all duration-200"
                                    placeholder="Add a note about this payment..."
                                />
                            </div>
                        </>
                    }


                </div>


                {/* buttons */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-2 py-5 mx-5">

                    <button
                        type="submit"
                        onClick={() => {
                            setLoadingType("creating")
                        }}
                        disabled={creatingInvoice}
                        className={`md:w-1/2 w-full border-[1.5px] border-gold text-gold-dark bg-gold rounded-[14px] py-2.5 text-[14px] font-semibold cursor-pointer hover:bg-gold/90 disabled:opacity-50 disabled:cursor-default`}
                    >
                        {loadingType === "creating" ? "Saving..." : "Save Invoice"}
                    </button>

                    <button
                        type="submit"
                        onClick={() => {
                            setLoadingType("drafting")
                        }}
                        disabled={creatingInvoice}
                        className={`md:w-1/2 w-full border-[1.5px] border-border text-text bg-card rounded-[14px] py-2.5 text-[14px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-default`}
                    >
                        {loadingType === "drafting" ? "Saving..." : "Save as Draft"}
                    </button>
                </div>

            </form>

            {
                showSelectedClientDatails &&
                <ClientDetailsMenu
                    client={selectedClient!}
                    onClose={() => setShowSelectedClientDatails(false)}
                />
            }
        </div>
    )
}