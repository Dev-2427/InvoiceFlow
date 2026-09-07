import { useEffect, useRef, useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { TbChevronDown } from "react-icons/tb";
import PaymentModeMenu from "../PaymentModeMenu";
import DatePicker from "../../ui/DatePicker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeInvoiceStatusSchema, type ChangeInvoiceStatusInput } from "../../../validation/invoice.validation";
import invoiceStore from "../../../store/invoiceStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface ChangePaymentStatusMenuProps {
    onCancel: () => void,
    isPaid: boolean
}

export default function ChangePaymentStatusMenu({ onCancel, isPaid }: ChangePaymentStatusMenuProps) {

    const navigate = useNavigate()

    const [showPaymentOptions, setShowPaymentOptions] = useState(false)
    const [showDayPicker, setShowDayPicker] = useState(false)

    const amount = invoiceStore((state) => state.invoiceOverviewData?.totalAmount)
    const changeInvoiceStatus = invoiceStore((state) => state.changeInvoiceStatus)
    const isChangingInvoiceStatus = invoiceStore((state) => state.isChangingInvoiceStatus)

    const paymentModeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (paymentModeRef.current && !paymentModeRef.current.contains(e.target as Node)) {
                setShowPaymentOptions(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [])

    const { handleSubmit, register, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(changeInvoiceStatusSchema),
        defaultValues: {
            status: isPaid ? "unpaid" : "paid",
            payment: !isPaid ? {
                amount,
                mode: "cash",
                receivedDate: new Date(),
                note: ""
            } : {
                amount: null,
                mode: null,
                receivedDate: null,
                note: ""
            }
        }
    })

    const invoiceStatus = watch("status")
    const paymentMode = watch("payment.mode")
    const paymentReceivedDate = watch("payment.receivedDate") as Date

    useEffect(() => {

        if (invoiceStatus === "paid") {

            if (amount === undefined || amount === null) {
                navigate("/invoices")
                return
            }
            setValue("payment", {
                amount,
                mode: "cash",
                receivedDate: new Date(),
                note: ""
            })
        } else {
            setValue("payment", {
                amount: null,
                mode: null,
                receivedDate: null,
                note: ""
            })
        }
    }, [invoiceStatus])

    async function onSubmit(data: ChangeInvoiceStatusInput) {
        const res = await changeInvoiceStatus(data)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
        onCancel()
    }


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex justify-center items-center">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="rounded-[14px] w-md bg-card py-5">

                <div className="flex items-center justify-between px-6 ">
                    <span className="text-text text-sm font-bold">Update Payment Status</span>
                    <HiXMark
                        onClick={() => !isChangingInvoiceStatus && onCancel()} className={`cursor-pointer text-text-sm text-2xl ${isChangingInvoiceStatus && "opacity-50"}`} />
                </div>

                <hr className="border border-border my-4" />

                {/* payment status */}
                <div className="px-6 flex flex-col gap-1">
                    <label className="text-text-sm text-[11px] font-bold">CHANGE STATUS TO</label>

                    <div className="flex w-full gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setValue("status", "paid", {
                                    shouldValidate: true
                                })
                            }
                            className={`w-1/2 border-[1.5px] rounded-xl py-2 font-semibold text-sm cursor-pointer ${invoiceStatus === "paid" ? "bg-navy-700 text-card border-navy-700" : "bg-card text-text border-border"}`}
                        >
                            Paid
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setValue("status", "unpaid", {
                                    shouldValidate: true
                                })
                            }
                            className={`w-1/2 border-[1.5px] rounded-xl py-2 font-semibold text-sm cursor-pointer ${invoiceStatus === "unpaid" ? "bg-navy-700 text-card border-navy-700" : "bg-card text-text border-border"}`}
                        >
                            Unpaid
                        </button>
                    </div>
                    <p className="min-h-6 text-xs text-overdue">
                        {errors.status?.message}
                    </p>
                </div>

                {invoiceStatus === "paid" &&
                    <>
                        {/* payment mode */}
                        <div
                            ref={paymentModeRef}
                            className="relative flex flex-col gap-1 px-6">
                            <label className="text-text-sm text-[11px] font-bold">PAYMENT MODE</label>

                            <button
                                type="button"
                                onClick={() => setShowPaymentOptions(prev => !prev)}
                                className="flex justify-between items-center border-[1.5px] border-border px-5 py-2.5 rounded-xl cursor-pointer">
                                <span className="capitalize text-text text-sm">{paymentMode}</span>
                                <TbChevronDown className={`${showPaymentOptions && "rotate-180"}`} />
                            </button>
                            {showPaymentOptions && <PaymentModeMenu onClose={() => setShowPaymentOptions(false)}
                                onChange={(mode) => setValue("payment.mode", mode,
                                    { shouldValidate: true }
                                )}
                                directionBottomLeft={true}
                            />}
                            <p className="min-h-6 text-xs text-overdue">
                                {errors.payment?.message}
                            </p>
                        </div>

                        {/* payment received date */}
                        <div className="relative flex flex-col gap-1 px-6">

                            <DatePicker
                                isOpen={showDayPicker}
                                directionCenterLeft={true}
                                label="PAYMENT RECEIVED DATE"
                                onClose={() => setShowDayPicker(false)}
                                onOpen={() => setShowDayPicker(true)}
                                onChange={(date) =>
                                    setValue("payment.receivedDate", date, {
                                        shouldValidate: true
                                    })
                                }
                                value={paymentReceivedDate}
                                error={errors.payment?.receivedDate && "Received date is required"}
                            />
                        </div>

                        {/* note */}
                        <div
                            className="relative flex flex-col gap-1 px-6">
                            <label className="text-text-sm text-[11px] font-bold">NOTE</label>

                            <input
                                {...register("payment.note")}
                                type="text"
                                className="border-[1.5px] border-border px-5 py-2.5 rounded-xl outline-none
                                placeholder:text-text-xs text-text-sm text-sm"
                                placeholder="Add a note about this payment..."
                            />

                            <p className="min-h-6 text-xs text-overdue">
                                {errors.payment?.message}
                            </p>
                        </div>
                    </>
                }

                {/* submit button and cancel button */}
                <div className="w-full px-6 flex gap-2">
                    <button
                        disabled={isChangingInvoiceStatus}
                        type="submit"
                        className="w-1/2 bg-gold text-gold-dark py-2 border-[1.5px] border-gold rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50"
                    >
                        {isChangingInvoiceStatus ? "Saving..." : "Confirm"}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isChangingInvoiceStatus}
                        className="w-1/2 bg-card text-text py-2 border-[1.5px] border-border rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>


        </div>
    )
}
