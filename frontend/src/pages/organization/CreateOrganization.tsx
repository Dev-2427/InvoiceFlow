import { BsCaretDownFill } from "react-icons/bs";
import Steps from "../../components/organization/Steps";
import BasicInfo from "../../components/organization/forms/BasicInfoForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOrganizationSchema, type CreateOrganizationInput } from "../../validation/organizationValidation";
import { useEffect, useState } from "react";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi2";
import AddressForm from "../../components/organization/forms/AddressForm";
import organizationStore from "../../store/organizationStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HiOfficeBuilding } from "react-icons/hi";
import CurrencyForm from "../../components/organization/forms/CurrencyForm";
import Review from "../../components/organization/forms/Review";
import UserContextMenu from "../../components/organization/UserContextMenu";
import useAuthUser from "../../hooks/useAuthUser";

export default function CreateOrganization() {

    useEffect(() => {
        document.body.style.backgroundColor = "#0D1F33"

        return () => {
            document.body.style.backgroundColor = ""
        }
    }, [])


    const user = useAuthUser()
    const CreateOrganization = organizationStore((state) => state.createOrganization)
    const isCreatingOrganization = organizationStore((state) => state.isCreatingOrganization)

    const navigate = useNavigate()

    const [showUserContextMenu, setShowUserContextMenu] = useState(false)
    const [step, setStep] = useState(1)


    const methods = useForm({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            organizationName: "",
            email: "",
            currencyCode: "",
            gstNumber: "",
            phone: "",
            phoneCode: "+91",
            address: {
                street1: "",
                street2: "",
                city: "",
                state: "",
                country: "",
                pincode: ""
            },
            termsAndConditions: ""
        }
    })

    const { trigger } = methods

    function handleBack() {
        setStep((step) => step - 1)
    }

    async function handleContinue() {
        const isValid = await trigger(
            step === 1 ? [
                "organizationName",
                "email",
                "phone",
                "phoneCode",
                "gstNumber"
            ] :
                step === 2 ?
                    [
                        "address.street1",
                        "address.street2",
                        "address.city",
                        "address.state",
                        "address.country",
                        "address.pincode"
                    ] :
                    [
                        "currencyCode",
                        "termsAndConditions"
                    ]
        )

        if (!isValid) return

        setStep((step) => step + 1)
        window.scroll(0, 0)
    }

    async function onSubmit(data: CreateOrganizationInput) {
        const payload = {
            ...data, phone: data.phone ? `${data.phoneCode} ${data.phone}` : ""
        }
        const res = await CreateOrganization(payload)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        navigate("/dashboard")
        toast.success(res.message)
    }


    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-navy-900 md:px-0 px-5 md:py-10 py-5 md:pt-30 pt-22">


            {/* nav  */}
            <nav className="flex flex-col gap-4 fixed top-0 right-0 left-0 w-full bg-navy-900 border-b border-border/10 backdrop-blur-lg z-50 py-3 px-5">
                <div className="flex justify-between">

                    <div className="flex items-center gap-2">
                        <img src="/InvoiceFlow.png"
                            alt="InvoiceFlow"
                            className="w-8 h-8 object-contain"
                        />
                        <span className="font-bold text-card text-[18px]">InvoiceFlow</span>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowUserContextMenu(prev => !prev)}
                        className="flex justify-center items-center gap-2 cursor-pointer border border-border/10 bg-navy-800/30 p-2 rounded-xl w-fit">
                        <div className="flex justify-center items-center bg-gold text-gold-dark rounded-full p-3 w-7 h-7 text-lg font-semibold">
                            <span>{user.firstName.charAt(0).toUpperCase()}</span>
                        </div>

                        <div className="flex items-center text-card font-semibold gap-1 text-sm capitalize">
                            <span>{user.firstName}</span>
                            <span>{user.lastName}</span>
                        </div>

                        <BsCaretDownFill className={`text-text-xs text-xs ${showUserContextMenu ? "rotate-180" : ""} transition-transform duration-200`} />
                    </button>
                </div>

                {showUserContextMenu &&
                    <UserContextMenu firstName={user.firstName} lastName={user.lastName} email={user.email} />
                }
            </nav>


            {/* form card  */}
            <div className="flex flex-col md:max-w-lg w-full bg-navy-700 rounded-2xl overflow-hidden mt-5 md:mt-0">

                {/* header  */}
                <div className="flex items-center gap-3 md:p-8 p-5">

                    <img src="/InvoiceFlow.png"
                        alt="InvoiceFlow"
                        className="md:w-10 md:h-10 w-8 h-8 object-contain"
                    />

                    <div className="flex flex-col">
                        <span className="text-card font-bold md:text-xl text-lg">Create Organisation</span>
                        <span className="text-navy-200 md:text-sm text-xs">Set up your business to start sending invoices</span>
                    </div>
                </div>


                {/* form  */}
                <FormProvider {...methods} >
                    <form onSubmit={methods.handleSubmit(onSubmit)}>

                        <div className="flex flex-col items-center w-full bg-card md:p-8 p-5">
                            <div className="flex justify-between items-center w-full">
                                <Steps info="BASIC INFO" status={step === 1 ? "current" : step > 1 ? "complete" : "pending"} step={1} />

                                <hr className={`${step > 1 ? "border-paid" : "border-border"} border-[1.5px] md:w-15 w-12`} />

                                <Steps info="ADDRESS" status={step === 2 ? "current" : step > 2 ? "complete" : "pending"} step={2} />
                                <hr className={`${step > 2 ? "border-paid" : "border-border"} border-[1.5px] md:w-15 w-12`} />

                                <Steps info="CURRENCY" status={step === 3 ? "current" : step > 3 ? "complete" : "pending"} step={3} />
                                <hr className={`${step > 3 ? "border-paid" : "border-border"} border-[1.5px] md:w-15 w-12`} />

                                <Steps info="REVIEW" status={step === 4 ? "current" : step > 4 ? "complete" : "pending"} step={4} />
                            </div>

                            <div className="py-8 w-full">
                                {step === 1 && <BasicInfo />}
                                {step === 2 && <AddressForm />}
                                {step === 3 && <CurrencyForm />}
                                {step === 4 && <Review />}
                            </div>

                            <div className="flex md:flex-row flex-col justify-between items-center w-full gap-3">

                                {step > 1 &&
                                    <button
                                        onClick={handleBack}
                                        type="button"
                                        className="flex justify-center items-center gap-1 bg-card text-text-md text-[14px] border-border border md:w-2/3 w-full rounded-xl py-3 cursor-pointer font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:opacity-93">
                                        <HiArrowLeft />
                                        Back
                                    </button>

                                }
                                {step !== 4 &&
                                    <button
                                        onClick={handleContinue}
                                        type="button"
                                        className="flex justify-center items-center gap-1 bg-navy-800 text-page text-[14px] w-full rounded-xl py-3 cursor-pointer font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:opacity-93">
                                        Continue
                                        <HiArrowRight />
                                    </button>
                                }

                                {step === 4 &&
                                    <button
                                        type="submit"
                                        disabled={isCreatingOrganization}
                                        className="flex justify-center items-center gap-1 bg-gold text-gold-dark text-[14px] w-full rounded-xl py-3 cursor-pointer font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:opacity-93">
                                        <HiOfficeBuilding size={20} />
                                        <p className="text-[15px]">{isCreatingOrganization ? "Creating..." : "Create organization"}</p>
                                    </button>
                                }
                            </div>

                            <p className="pt-5 text-xs text-text-sm font-semibold">Step {step} of 4</p>
                        </div>

                    </form>
                </FormProvider>

            </div >

            <p className="text-text-sm text-xs py-5">You can edit all details except currency later in Settings</p>
        </main >
    )
}
