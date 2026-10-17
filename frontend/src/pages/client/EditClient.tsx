import { TbCheck, TbChevronDown, TbXFilled } from "react-icons/tb";
import Header from "../../components/ui/Header";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import clientStore from "../../store/clientStore";
import { Country } from "country-state-city";
import organizationStore from "../../store/organizationStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { baseClientSchema, type BaseClientInput } from "../../validation/clientValidation";
import { HiLockClosed } from "react-icons/hi2";

const SALUTATIONS = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."] as const

export default function EditClient() {

    const navigate = useNavigate()
    const { id } = useParams()

    const getClientOverview = clientStore((state) => state.getClientOverview)
    const clientOverviewData = clientStore((state) => state.clientOverviewData)
    const updateClient = clientStore((state) => state.updateClient)
    const isUpdatingClient = clientStore((state) => state.isUpdatingClient)

    const organization = organizationStore((state) => state.organization)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [search, setSearch] = useState("")
    const countries = Country.getAllCountries()
    const filteredCountries = countries.filter((country) => country.name.toLowerCase().includes(search.toLocaleLowerCase()))


    const [isSalutationMenuVisible, setIsSalutationMenuVisible] = useState(false)
    const [isSameAsBillingAddress, setIsSameAsBillingAddress] = useState(false)

    const salutationRef = useRef<HTMLDivElement>(null)
    const phoneRef = useRef<HTMLDivElement>(null)

    const { register, reset, watch, handleSubmit, setValue, clearErrors, formState: { errors } } = useForm({
        resolver: zodResolver(baseClientSchema)
    })


    const currentSalutation = watch("salutation")
    const currentPhoneCode = watch("phoneCode")
    const currentClientType = watch("clientType")


    useEffect(() => {
        async function fetchClientOverview() {
            if (!id) {
                return navigate("/clients")
            }

            const res = await getClientOverview(id)

            if (!res.success) {
                navigate(-1)
                toast.error(res.message)
                return
            }
        }

        fetchClientOverview()
    }, [id])

    useEffect(() => {
        if (!clientOverviewData) return

        const [phoneCode, phone] = clientOverviewData.phone?.split(" ") || ["+91", ""]

        reset({
            clientType: clientOverviewData.clientType || "business",
            salutation: clientOverviewData.salutation || "Mr.",
            firstName: clientOverviewData.firstName || "",
            lastName: clientOverviewData.lastName || "",
            companyName: clientOverviewData.companyName || "",
            displayName: clientOverviewData.displayName || "",
            email: clientOverviewData.email || "",
            phoneCode,
            phone,
            billingAddress: clientOverviewData.billingAddress || undefined,
            shippingAddress: clientOverviewData.shippingAddress || undefined
        })
    }, [clientOverviewData])

    useEffect(() => {
        function salutationOutsideClick(e: MouseEvent) {
            if (salutationRef.current && !salutationRef.current.contains(e.target as Node)) {
                setIsSalutationMenuVisible(false)
            }
        }

        function phoneOutsideClick(e: MouseEvent) {
            if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", salutationOutsideClick)
        document.addEventListener("mousedown", phoneOutsideClick)

        return (() => {
            document.removeEventListener("mousedown", salutationOutsideClick)
            document.removeEventListener("mousedown", phoneOutsideClick)
        })
    }, [])


    async function onSubmit(data: BaseClientInput) {

        const { phoneCode, phone, shippingAddress, ...formData } = data

        const payload = {
            ...formData,
            shippingAddress: isSameAsBillingAddress ? data.billingAddress : shippingAddress,
            phone: phone ? phoneCode + " " + phone : null
        }

        const res = await updateClient(payload)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
        navigate(`/clients/${res.data.clientId}`)
    }

    return (
        <main className="space-y-5 mb-5">
            <Header header="Clients" />

            <header className="flex justify-between items-center px-5 lg:pt-4">
                <span className="text-text font-bold text-[22px]">Edit Client</span>

                <button
                    onClick={() => navigate(-1)}
                    type="button"
                    className="flex justify items-center gap-1 text-text-sm text-[15px] cursor-pointer font-semibold">
                    <TbXFilled />
                    <span>Cancel</span>
                </button>
            </header>


            <form
                className="space-y-5"
                onSubmit={handleSubmit(onSubmit, (errors) => { console.log("form", errors) })}>

                {/* customer type */}
                <div className="bg-card p-5 mx-5 rounded-[14px] space-y-2">
                    <p className="font-bold text-text">Customer Type</p>

                    <div className="flex items-center w-full gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setValue("clientType", "business", {
                                    shouldValidate: true
                                })
                                clearErrors(["firstName", "companyName"])
                            }}
                            className={`${currentClientType === "business" ? "bg-navy-700 text-card border-navy-700" : "bg-card text-text  border-border"} w-1/2 border-[1.5px] rounded-[14px] py-2.5 text-[15px] cursor-pointer`}>Business</button>

                        <button
                            type="button"
                            onClick={() => {
                                setValue("clientType", "individual", {
                                    shouldValidate: true
                                })
                                clearErrors(["firstName", "companyName"])
                            }}
                            className={`${currentClientType === "individual" ? "bg-navy-700 text-card" : "bg-card text-text  border-border"} w-1/2 border-[1.5px] rounded-[14px] py-2.5 text-[15px] cursor-pointer`}>Individual</button>

                    </div>
                </div>

                {/* name & contact */}
                <div className="bg-card p-5 mx-5 rounded-[14px] space-y-2">

                    <p className="font-bold text-text mb-4">Name & Contact</p>

                    <div className="sm:flex items-start gap-3">

                        {/* first name  */}
                        <div className="flex items-start gap-3 grow">
                            <div
                                ref={salutationRef}
                                className="relative space-y-1">
                                <p className="text-[11px] text-text-sm font-bold">SALUTATION</p>
                                <button
                                    type="button"
                                    onClick={() => setIsSalutationMenuVisible(prev => !prev)}
                                    className="flex justify-center items-center gap-2 border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm text-[13px] w-18 cursor-pointer"
                                >
                                    <span>{currentSalutation}</span>
                                    <TbChevronDown className={`${isSalutationMenuVisible && "rotate-180"}`} />
                                </button>


                                {isSalutationMenuVisible &&
                                    <div className="absolute bg-card border-[1.5px] border-border rounded-[14px] p-2 z-50">
                                        {SALUTATIONS.map((salutation) => (

                                            < button
                                                onClick={() => {
                                                    setIsSalutationMenuVisible(false)
                                                    setValue("salutation", salutation, {
                                                        shouldValidate: true
                                                    })
                                                }}
                                                key={salutation}
                                                type="button"
                                                className={`flex justify-center items-center w-18 px-3 py-2 rounded-lg cursor-pointer text-sm  ${currentSalutation === salutation ? "bg-navy-700 text-card" : "text-text"}
                                    `}
                                            >
                                                {salutation}
                                            </button>
                                        ))}
                                    </div>
                                }

                            </div>


                            <div className="flex flex-col gap-1 grow min-w-0">
                                <label htmlFor="firstName" className='text-text-sm font-bold text-[11px]'>FIRST NAME *</label>

                                <input
                                    {...register("firstName")}
                                    spellCheck={false}
                                    className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                    placeholder={"First name"} id="firstName" />

                                <p className="min-h-5 text-xs text-overdue">
                                    {errors.firstName?.message}
                                </p>
                            </div>

                        </div>

                        {/* last name  */}
                        <div className="flex flex-col gap-1 grow min-w-0">
                            <label htmlFor="lastName" className='text-text-sm font-bold text-[11px]'>LAST NAME</label>

                            <input
                                {...register("lastName")}
                                spellCheck={false}
                                className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] w-full text-sm transition-all duration-200'
                                placeholder="Last name" id="lastName" />

                            <p className="min-h-5 text-xs text-overdue">
                                {errors.lastName?.message}
                            </p>
                        </div>
                    </div>


                    <div className="flex flex-col sm:flex-row items-center sm:gap-3">

                        {/* company name */}
                        <div className="flex flex-col gap-1 grow min-w-0 w-full">
                            <label htmlFor="companyName" className='text-text-sm font-bold text-[11px]'>COMPANY NAME</label>

                            <input
                                {...register("companyName")}
                                spellCheck={false}
                                className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                placeholder={"Company name"} id="companyName" />

                            <p className="min-h-5 text-xs text-overdue">
                                {errors.companyName?.message}
                            </p>
                        </div>

                        {/* display name  */}
                        <div className="flex flex-col gap-1 grow min-w-0 w-full">
                            <label htmlFor="displayName" className='text-text-sm font-bold text-[11px]'>DISPLAY NAME * (UNIQUE)</label>

                            <input
                                {...register("displayName")}
                                spellCheck={false}
                                className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                placeholder={"Display name"} id="displayName" />

                            <p className="min-h-5 text-xs text-overdue">
                                {errors.displayName?.message}
                            </p>
                        </div>


                    </div>


                    <div className="flex flex-col md:flex-row items-start md:gap-3">

                        {/* phone */}
                        <div className="flex flex-col gap-1 grow min-w-0 w-full">

                            <label
                                htmlFor="phoneNumber"
                                className="text-[11px] text-text-sm font-bold"
                            >
                                PHONE NUMBER
                            </label>

                            <div className="flex items-start gap-2">

                                <div
                                    ref={phoneRef}
                                    className="relative shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(prev => !prev)}
                                        className="flex justify-center items-center gap-2 border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm text-[13px] w-18 cursor-pointer"
                                    >
                                        <span>{currentPhoneCode}</span>
                                        <TbChevronDown
                                            className={`${isDropdownOpen && "rotate-180"}`}
                                        />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-64 rounded-lg border-[1.5px] border-border bg-card shadow-lg p-2 z-10">
                                            <input
                                                type="text"
                                                value={search}
                                                spellCheck={false}
                                                onChange={(e) => setSearch(e.target.value)}
                                                placeholder="Search country..."
                                                className="w-full border-[1.5px] border-border rounded-lg px-3 py-2 text-sm outline-none mb-2 text-text placeholder:text-text"
                                            />

                                            <div className="max-h-40 overflow-y-auto">
                                                {filteredCountries.map((country) => {
                                                    const isSelected = currentPhoneCode === `+${country.phonecode}`
                                                    return (
                                                        <button
                                                            key={country.isoCode}
                                                            type="button"
                                                            onClick={() => {
                                                                setIsDropdownOpen(false)
                                                                setValue("phoneCode", `+${country.phonecode}`)
                                                            }}
                                                            className={`flex justify-between items-center w-full px-3 py-2 rounded-lg cursor-pointer ${isSelected && "bg-navy-700 text-card"}`}
                                                        >
                                                            <span>{country.name}</span>
                                                            <span>+{country.phonecode}</span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>


                                <div className="flex flex-col gap-1 grow min-w-0">
                                    <input
                                        {...register("phone")}
                                        spellCheck={false}
                                        className="w-full border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200"
                                        placeholder="Phone number"
                                        id="phoneNumber"
                                    />

                                    <p className="min-h-5 text-xs text-overdue">
                                        {errors.phone?.message}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* email */}
                        <div className="flex flex-col gap-1 grow min-w-0 w-full">

                            <label
                                htmlFor="email"
                                className="text-[11px] text-text-sm font-bold"
                            >
                                EMAIL
                            </label>

                            <input
                                {...register("email")}
                                spellCheck={false}
                                className="w-full border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200"
                                placeholder="Email"
                                id="email"
                            />

                            <p className="min-h-5 text-xs text-overdue">
                                {errors.email?.message}
                            </p>

                        </div>

                    </div>

                </div>

                {/* currency card */}
                <div className="bg-card p-5 mx-5 rounded-[14px] space-y-2">
                    <p className="font-bold text-text">Currency</p>

                    <div className="flex justify-between items-center w-full gap-2 bg-page border-[1.5px] border-border rounded-[14px] px-3 py-2">
                        <span className="font-bold text-text text-sm">{organization?.currency.code}</span>

                        <div className="flex items-center gap-1 text-gold text-xs">
                            <HiLockClosed />
                            <span>Set by organization</span>
                        </div>
                    </div>
                </div>


                {/* billing address */}
                <div className="bg-card border-[1.5px] border-border rounded-[14px] p-5 mx-5">

                    <p className="font-bold text-[16px] mb-4">Billing Address</p>


                    <div className="flex items-center gap-3">

                        <div className="flex flex-col gap-1 grow min-w-0 w-full">
                            <label htmlFor="country" className='text-text-sm font-bold text-[11px]'>COUNTRY</label>

                            <input
                                {...register("billingAddress.country")}
                                spellCheck={false}
                                className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                placeholder={"Country"} id="country" />

                            <p className="min-h-5 text-xs text-overdue">
                                {errors.billingAddress?.country?.message}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 grow min-w-0 w-full">
                            <label htmlFor="state" className='text-text-sm font-bold text-[11px]'>STATE</label>

                            <input
                                {...register("billingAddress.state")}
                                spellCheck={false}
                                className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                placeholder={"State"} id="state" />

                            <p className="min-h-5 text-xs text-overdue">
                                {errors.billingAddress?.state?.message}
                            </p>
                        </div>

                    </div>


                    <div className="flex flex-col gap-1 grow min-w-0 w-full">
                        <label htmlFor="streetLine1" className='text-text-sm font-bold text-[11px]'>STREET LINE 1</label>

                        <input
                            {...register("billingAddress.street1")}
                            spellCheck={false}
                            className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                            placeholder={"Street line 1"} id="streetLine1" />

                        <p className="min-h-5 text-xs text-overdue">
                            {errors.billingAddress?.street1?.message}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1 grow min-w-0 w-full">
                        <label htmlFor="streetLine2" className='text-text-sm font-bold text-[11px]'>STREET LINE 2</label>

                        <input
                            {...register("billingAddress.street2")}
                            spellCheck={false}
                            className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                            placeholder={"Street line 2"} id="streetLine2" />

                        <p className="min-h-5 text-xs text-overdue">
                            {errors.billingAddress?.street2?.message}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="flex flex-col gap-1 grow min-w-0 w-full">
                            <label htmlFor="city" className='text-text-sm font-bold text-[11px]'>CITY</label>

                            <input
                                {...register("billingAddress.city")}
                                spellCheck={false}
                                className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                placeholder={"City"} id="city" />

                            <p className="min-h-5 text-xs text-overdue">
                                {errors.billingAddress?.city?.message}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 grow min-w-0 w-full">
                            <label htmlFor="pincode" className='text-text-sm font-bold text-[11px]'>PINCODE</label>

                            <input
                                {...register("billingAddress.pincode")}
                                spellCheck={false}
                                className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                placeholder={"Pincode"} id="pincode" />

                            <p className="min-h-5 text-xs text-overdue">
                                {errors.billingAddress?.pincode?.message}
                            </p>
                        </div>

                    </div>

                </div>

                {/* shipping address */}
                <div className="bg-card border-[1.5px] border-border rounded-[14px] p-5 mx-5">

                    <div className={`flex justify-between items-center ${!isSameAsBillingAddress && "mb-4"}`}>
                        <p className="font-bold text-[16px]">Shipping Address</p>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setIsSameAsBillingAddress(prev => !prev)}
                                className={`flex justify-center items-center border-[1.5px] rounded-[5px] text-sm h-4 w-4 ${isSameAsBillingAddress ? "bg-navy-700 text-card" : "border-border text-text"} cursor-pointer`}
                            >
                                {isSameAsBillingAddress && <TbCheck />}
                            </button>

                            <span className="text-sm text-text-sm">Same as billing</span>
                        </div>

                    </div>

                    {!isSameAsBillingAddress &&
                        <>
                            <div className="flex items-center gap-3">

                                <div className="flex flex-col gap-1 grow min-w-0 w-full">
                                    <label htmlFor="countryForShip" className='text-text-sm font-bold text-[11px]'>COUNTRY</label>

                                    <input
                                        {...register("shippingAddress.country")}
                                        spellCheck={false}
                                        className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                        placeholder={"Country"} id="countryForShip" />

                                    <p className="min-h-5 text-xs text-overdue">
                                        {errors.shippingAddress?.country?.message}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1 grow min-w-0 w-full">
                                    <label htmlFor="stateForShip" className='text-text-sm font-bold text-[11px]'>STATE</label>

                                    <input
                                        {...register("shippingAddress.state")}
                                        spellCheck={false}
                                        className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                        placeholder={"State"} id="stateForShip" />

                                    <p className="min-h-5 text-xs text-overdue">
                                        {errors.shippingAddress?.state?.message}
                                    </p>
                                </div>

                            </div>


                            <div className="flex flex-col gap-1 grow min-w-0 w-full">
                                <label htmlFor="streetLine1ForShip" className='text-text-sm font-bold text-[11px]'>STREET LINE 1</label>

                                <input
                                    {...register("shippingAddress.street1")}
                                    spellCheck={false}
                                    className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                    placeholder={"Street line 1"} id="streetLine1ForShip" />

                                <p className="min-h-5 text-xs text-overdue">
                                    {errors.shippingAddress?.street1?.message}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 grow min-w-0 w-full">
                                <label htmlFor="streetLine2ForShip" className='text-text-sm font-bold text-[11px]'>STREET LINE 2</label>

                                <input
                                    {...register("shippingAddress.street2")}
                                    spellCheck={false}
                                    className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                    placeholder={"Street line 2"} id="streetLine2ForShip" />

                                <p className="min-h-5 text-xs text-overdue">
                                    {errors.shippingAddress?.street2?.message}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">

                                <div className="flex flex-col gap-1 grow min-w-0 w-full">
                                    <label htmlFor="cityForShip" className='text-text-sm font-bold text-[11px]'>CITY</label>

                                    <input
                                        {...register("shippingAddress.city")}
                                        spellCheck={false}
                                        className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                        placeholder={"City"} id="cityForShip" />

                                    <p className="min-h-5 text-xs text-overdue">
                                        {errors.shippingAddress?.city?.message}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-1 grow min-w-0 w-full">
                                    <label htmlFor="pincodeForShip" className='text-text-sm font-bold text-[11px]'>PINCODE</label>

                                    <input
                                        {...register("shippingAddress.pincode")}
                                        spellCheck={false}
                                        className='border-text-sm border rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] text-sm transition-all duration-200'
                                        placeholder={"Pincode"} id="pincodeForShip" />

                                    <p className="min-h-5 text-xs text-overdue">
                                        {errors.shippingAddress?.pincode?.message}
                                    </p>
                                </div>

                            </div>
                        </>
                    }
                </div>

                {/* submit and cancel button */}
                <div className="flex items-center gap-2 mx-5">
                    <button
                        type="submit"
                        disabled={isUpdatingClient}
                        className={`w-1/2 border-[1.5px] border-gold text-gold-dark bg-gold rounded-[14px] py-2.5 text-[14px] font-semibold cursor-pointer hover:bg-gold/90 disabled:opacity-50 disabled:cursor-default`}>{isUpdatingClient ? "Saving..." : "Save Client"}</button>

                    <button
                        type="button"
                        disabled={isUpdatingClient}
                        onClick={() => navigate("/clients", { replace: true })}
                        className="w-1/2 border-[1.5px] border-border bg-card text-text rounded-[14px] py-2.5 text-[14px] font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-default">Cancel</button>

                </div>

            </form>

        </main>
    )
}
