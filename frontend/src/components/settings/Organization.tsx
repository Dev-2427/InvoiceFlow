import toast from "react-hot-toast"
import organizationStore from "../../store/organizationStore"
import { updateOrganizationSchema, type UpdateOrganizationInput } from "../../validation/organizationValidation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { organizationData } from "../../types/organization.types"
import AuthInput from "../auth/AuthInput"
import { useEffect, useRef, useState } from "react"
import { Country } from "country-state-city";
import { HiChevronDown } from "react-icons/hi2"
import formatLocalDate from "../../utils/dateUtils"

interface OrganizationProp {
    organization: organizationData
}

export default function Organization({ organization }: OrganizationProp) {

    const updateOrganizationLogo = organizationStore((state) => state.updateOrganizationLogo)
    const isUpdatingLogo = organizationStore((state) => state.isUpdatingLogo)
    const removeOrganizationLogo = organizationStore((state) => state.removeOrganizationLogo)
    const isUpdatingOrganizationData = organizationStore((state) => state.isUpdatingOrganizationData)
    const updateOrganization = organizationStore((state) => state.updateOrganization)

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const countries = Country.getAllCountries()

    const [search, setSearch] = useState("")
    const filteredCountries = countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase()))

    const dropdownRef = useRef<HTMLDivElement>(null)

    const [phoneCode, phoneNumber] = organization.phone?.split(" ") ?? []

    const { register, watch, handleSubmit, setValue, formState: { errors, isDirty } } = useForm({
        resolver: zodResolver(updateOrganizationSchema),
        defaultValues: {
            organizationName: organization.organizationName,
            email: organization.email,
            gstNumber: organization.gstNumber ?? "",
            termsAndConditions: organization.termsAndConditions,
            phoneCode: phoneCode || "+91",
            phone: phoneNumber ?? ""
        }
    })

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]

        if (!file) return

        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
            toast.error("Only JPG and PNG images are allowed.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Logo must be smaller than 5MB.")
            return
        }

        const res = await updateOrganizationLogo(organization._id, file)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    async function handleRemoveLogo() {

        if (!organization.logo?.url) return

        const res = await removeOrganizationLogo(organization._id)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    async function onSubmit(data: UpdateOrganizationInput) {
        const res = await updateOrganization(organization._id, data)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    const phoneCodeValue = watch("phoneCode")

    return (
        <div className="px-5 space-y-5 max-w-2xl">

            {/* organization logo */}
            <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-4">

                {/* header */}
                <div>
                    <span className="text-text text-[15px] font-bold">Organisation Logo</span>
                    <p className="text-[13px] text-text-sm">Shown on invoices and across the app</p>
                </div>

                <hr className="border border-border/70" />

                {/* logo, name and email */}
                <div className="flex items-center gap-3">

                    {organization.logo?.url ?
                        <img
                            className="h-15 w-15 object-cover rounded-lg shrink-0"
                            src={organization.logo.url} />
                        :

                        <div className="flex justify-center items-center rounded-lg w-15 h-15 bg-gold text-gold-dark font-bold text-3xl shrink-0">
                            {organization.organizationName.charAt(0).toUpperCase()}
                        </div>
                    }

                    <div className="flex flex-col justify-center min-w-0">
                        <span className="text-text text-[15px] font-bold capitalize">{organization.organizationName}</span>

                        <span className="text-[13px] text-text-sm break-all">{organization.email}</span>

                        <div className="flex items-center gap-2">

                            <label
                                htmlFor={isUpdatingLogo ? undefined : "organization-logo"}
                                className={`border-[1.5px] border-border rounded-lg px-3 w-fit text-[13px] font-semibold text-text-md py-1.5 hover:bg-navy-50 my-1.5 ${isUpdatingLogo ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                            >
                                Upload Logo
                            </label>

                            <input
                                id="organization-logo"
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => handleLogoChange(e)}
                                className="hidden"
                            />

                            {organization.logo?.url &&
                                <button
                                    onClick={handleRemoveLogo}
                                    type="button"
                                    disabled={isUpdatingLogo}
                                    className="bg-overdue-bg text-overdue hover:bg-overdue-bg/90 rounded-lg py-1.5 px-3 text-[13px] font-semibold cursor-pointer border-[1.5px] disabled:opacity-50 disabled:pointer-events-none">
                                    Remove
                                </button>
                            }

                        </div>

                        <span className="text-text-xs text-[10px] font-semibold">JPG or PNG · MAX 5MB</span>

                    </div>

                </div>

            </div>


            {/* personal details */}
            <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-4">

                {/* header */}
                <div>
                    <span className="text-text text-[15px] font-bold">Personal Details</span>
                    <p className="text-[13px] text-text-sm">Update your name and country</p>
                </div>

                <hr className="border border-border/70" />

                {/* details form*/}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex flex-col items-center w-full">

                        <div className="sm:flex w-full sm:gap-3 items-center">

                            {/* organization name */}
                            <AuthInput
                                id="organizationName" placeholder="Organization Name" type="text" label="ORGANIZATION NAME *"
                                register={register("organizationName")}
                                errorMessage={errors.organizationName?.message}
                            />

                            {/* organization email */}
                            <AuthInput
                                id="email"
                                placeholder="Email"
                                type="text"
                                label="BUSINESS EMAIL *"
                                register={register("email")}
                                errorMessage={errors.email?.message}
                            />

                        </div>

                        {/* phone */}
                        <div className="flex flex-col items-center gap-1.5 w-full">

                            <label
                                htmlFor="phone"
                                className="flex self-start text-text-sm font-bold text-[11px]"
                            >
                                PHONE NUMBER
                            </label>

                            <div
                                ref={dropdownRef}
                                className="relative flex gap-1.5 w-full">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(prev => !prev)}
                                    className="flex items-center gap-2 min-w-15 border-border border-[1.5px] rounded-lg py-2.5 px-3 h-10 text-text-sm text-sm cursor-pointer"
                                >
                                    {phoneCodeValue}
                                    <HiChevronDown className={`${isDropdownOpen ? "rotate-180" : ""} text-xl transition-transform duration-200`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-64 rounded-lg border-[1.5px] border-border bg-card shadow-lg p-2 z-10">

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search country..."
                                            className="w-full border-[1.5px] border-border rounded-lg px-3 py-2 text-sm outline-none mb-2 text-text placeholder:text-text"
                                        />

                                        <div className="max-h-40 overflow-y-auto">
                                            {filteredCountries.map((country) => {
                                                const isSelected = phoneCodeValue === `+${country.phonecode}`;

                                                return (
                                                    < button
                                                        onClick={() => {
                                                            setIsDropdownOpen(false)
                                                            setValue("phoneCode", `+${country.phonecode}`, {
                                                                shouldValidate: true,
                                                                shouldDirty: true
                                                            })
                                                        }}
                                                        key={country.isoCode}
                                                        type="button"
                                                        className={`flex justify-between items-center w-full px-3 py-2 rounded-lg cursor-pointer ${isSelected ? "bg-navy-700 text-page" : "text-text"}`}
                                                    >

                                                        <span>{country.name}</span>

                                                        <span>+{country.phonecode}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                <input
                                    {...register("phone")}
                                    className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] w-full text-sm transition-all duration-200'
                                    placeholder="Phone"
                                    type="tel" id="phone" />
                            </div>
                            <p className="min-h-5 text-xs text-overdue">
                                {errors.phone?.message}
                            </p>
                        </div>

                        {/* gst / tax number */}
                        <AuthInput
                            id="gstNumber"
                            placeholder="Number"
                            type="text"
                            label="GST / TAX NUMBER"
                            register={register("gstNumber")}
                            errorMessage={errors.gstNumber?.message}
                        />

                        {/* currency */}
                        <div className="mb-5">
                            <div className="flex justify-between items-center bg-page border-[1.5px] border-border border-dashed rounded-lg px-3 py-2.5 w-full ">
                                <span className="text-text text-sm font-semibold">{organization.currency.code} — {organization.currency.symbol}</span>
                                <span className="text-gold-mid text-[12px] font-semibold">🔒 This cannot be changed</span>

                            </div>

                            <p className="min-h-5 text-[11px] text-text-sm">
                                Currency is set at organisation creation and cannot be changed. Create a new organisation to use a different currency.
                            </p>
                        </div>

                        {/* createdAt */}
                        <div className="flex items-center gap-1 mb-5 self-start">
                            <span className="text-[11px] text-text-sm">Organization created on</span>

                            <div className="flex justify-center items-center px-2 py-1 bg-page border border-border rounded-[14px] text-text-sm text-[11px] font-bold">
                                {formatLocalDate(organization.createdAt)}
                            </div>
                        </div>

                    </div>

                    <button
                        disabled={isUpdatingOrganizationData || !isDirty}
                        type="submit"
                        className="bg-gold text-gold-dark hover:bg-gold/90 rounded-lg py-2.5 w-full text-[15px] font-bold cursor-pointer disabled:opacity-50 disabled:pointer-events-none">
                        {isUpdatingOrganizationData ? "Saving..." : "Save Changes"}
                    </button>

                </form>

            </div>

        </div>
    )
}
