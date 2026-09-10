import { HiEnvelope, HiTrash } from "react-icons/hi2"
import { TbArrowDown, TbArrowLeft, TbCheckFilled, TbCopy, TbPencil } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import invoiceStore from "../../../store/invoiceStore"
import { useState } from "react"
import toast from "react-hot-toast"
import DeleteInvoicesContext from "../DeleteInvoicesContext"
import ChangePaymentStatusMenu from "./ChangePaymentStatusMenu"

interface ActionButtonsProps {
    onDownloadPdf: () => void,
    onSendEmail: () => void
}

export default function ActionButtons({ onDownloadPdf, onSendEmail }: ActionButtonsProps) {

    const navigate = useNavigate()

    const isPerformingAction = invoiceStore((state) => state.isPerformingAction)
    const deleteOverviewInvoice = invoiceStore((state) => state.deleteOverviewInvoice)
    const changeLogoVisibility = invoiceStore((state) => state.changeLogoVisibility)
    const invoiceOverviewData = invoiceStore((state) => state.invoiceOverviewData)

    const [showDeleteContextMenu, setShowDeleteContextMenu] = useState(false)
    const [showChangePaymentStatusContextMenu, setShowChangePaymentStatusContextMenu] = useState(false)

    async function handleInvoiceDeletion() {
        const res = await deleteOverviewInvoice()

        if (!res.success) {
            toast.error(res.message)
            return
        }

        setShowDeleteContextMenu(false)

        navigate("/invoices")
        toast.success(res.message)
    }

    async function handleShowLogoToggle(showLogo: boolean) {
        const res = await changeLogoVisibility(showLogo)

        if (!res.success) {
            toast.error(res.message)
            return
        }
    }

    const isDeleted = invoiceOverviewData?.isDeleted
    const showLogo = invoiceOverviewData?.showLogo
    const invoiceStatus = invoiceOverviewData?.status

    return (
        <div className="flex flex-col gap-2 px-5 mt-5">

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2 ">

                {/* back  */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 px-3 py-2 border-[1.5px] border-border rounded-[10px] text-xs text-text font-semibold bg-card cursor-pointer w-fit">
                    <TbArrowLeft />
                    <span>Back</span>
                </button>

                <div className={`flex items-center flex-wrap gap-2 ${isDeleted && "hidden"}`}>
                    {invoiceStatus !== "draft" &&
                        <>

                            {/* mark as paid or unpaid */}
                            <button
                                type="button"
                                onClick={() => setShowChangePaymentStatusContextMenu(true)}
                                disabled={isPerformingAction}
                                className={`flex items-center gap-1 border-[1.5px] border-navy-700 rounded-[10px] px-3 py-2 text-xs font-semibold bg-navy-700 text-card cursor-pointer hover:bg-navy-800 disabled:opacity-50 disabled:cursor-default`}>
                                <TbCheckFilled size={15} />
                                <span>{invoiceStatus === "paid" ? "Mark as Unpaid" : "Mark as Paid"}</span>
                            </button>

                            {/* pdf */}
                            <button
                                type="button"
                                onClick={onDownloadPdf}
                                disabled={isPerformingAction}
                                className={`flex items-center gap-1 border-[1.5px] border-gold rounded-[10px] px-3 py-2 font-bold bg-gold text-gold-dark hover:bg-gold/90 text-xs cursor-pointer disabled:opacity-50 disabled:cursor-default`}>
                                <TbArrowDown />
                                <span>PDF</span>
                            </button>

                            {/* email */}
                            <button
                                type="button"
                                onClick={onSendEmail}
                                disabled={isPerformingAction}
                                className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-xs font-semibold bg-card text-text cursor-pointer disabled:opacity-50 disabled:cursor-default hover:bg-navy-50`}
                            >
                                <HiEnvelope />
                                <span>Email</span>
                            </button>
                        </>
                    }
                    {/* edit */}
                    <button
                        type="button"
                        onClick={() => {
                            navigate(`/invoices/${invoiceOverviewData?._id}/edit`, { replace: true })
                        }}
                        disabled={isPerformingAction}
                        className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-xs font-semibold bg-card text-text cursor-pointer disabled:opacity-50 disabled:cursor-default hover:bg-navy-50`}
                    >
                        <TbPencil />
                        <span>Edit</span>
                    </button>

                    {invoiceStatus !== "draft" &&
                        <>
                            {/* clone */}
                            < button
                                type="button"
                                onClick={() => {
                                    navigate("/invoices/new", {
                                        state: { cloneInvoice: invoiceOverviewData }
                                    })
                                }}
                                disabled={isPerformingAction}
                                className={`flex items-center gap-1 border-[1.5px] border-border rounded-[10px] px-3 py-2 text-xs font-semibold bg-card text-text cursor-pointer disabled:opacity-50 disabled:cursor-default hover:bg-navy-50`
                                }
                            >
                                <TbCopy />
                                <span>Clone</span>
                            </button>
                        </>
                    }
                    {/* delete */}
                    <button
                        type="button"
                        onClick={() => setShowDeleteContextMenu(true)}
                        disabled={isPerformingAction}
                        className={`flex items-center gap-1 border-[1.5px] border-overdue rounded-[10px] px-3 py-2 text-xs font-semibold bg-overdue-bg text-overdue cursor-pointer disabled:opacity-50 disabled:cursor-default`}
                    >
                        <HiTrash />
                        <span>Delete</span>
                    </button>

                </div>


                {/* delete client context menu */}
                <DeleteInvoicesContext isOpen={showDeleteContextMenu} invoiceCount={1} onCancel={() => setShowDeleteContextMenu(false)} onDelete={handleInvoiceDeletion} isDeleting={isPerformingAction} />

            </div>

            {/* logo toggle */}
            {
                !isDeleted && invoiceStatus !== "draft" &&
                (
                    <div className="flex justify-end my-1">

                        <div className="flex items-center gap-2">
                            <span className="text-text-sm text-sm">Logo in PDF</span>

                            <button
                                type="button"
                                onClick={() => handleShowLogoToggle(!showLogo)}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${showLogo ? "bg-gold" : "bg-border"
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${showLogo ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>
                )
            }


            {
                showChangePaymentStatusContextMenu &&
                <ChangePaymentStatusMenu
                    isPaid={invoiceStatus === "paid"}
                    onCancel={() => setShowChangePaymentStatusContextMenu(false)}
                />
            }

        </div >
    )
}
