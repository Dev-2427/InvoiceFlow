import { useFormContext } from "react-hook-form";
import AuthInput from "../../auth/AuthInput";
import type { CreateOrganizationInput } from "../../../validation/organizationValidation";
import { HiChevronDown } from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";
import { Country } from "country-state-city";

export default function AddressForm() {

    const { register, setValue, watch, formState: { errors } } = useFormContext<CreateOrganizationInput>()
    const countryValue = watch("address.country")

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [search, setSearch] = useState("")
    const countries = Country.getAllCountries()

    const filteredCountries = countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase()))

    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
                setIsDropdownOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


    return (
        <div className="flex flex-col items-center gap-5">

            <div className="flex items-center self-start gap-2">
                <div className="flex justify-center items-center w-7 h-7 bg-navy-50 text-navy-700 font-semibold rounded-full">
                    2
                </div>
                <p className="font-semibold text-navy-700">Address</p>
            </div>


            <div className="flex flex-col items-center w-full">
                <AuthInput
                    id="street1" placeholder="Street adress line 1" type="text" label="STREET ADDRESS LINE 1"
                    register={register("address.street1")}
                    errorMessage={errors.address?.street1?.message}
                />

                <AuthInput
                    id="street2"
                    placeholder="Street address line 2"
                    type="text"
                    label="STREET ADDRESS LINE 2"
                    register={register("address.street2")}
                    optional={true}
                    errorMessage={errors.address?.street2?.message}
                />


                <div className="flex md:flex-row flex-col justify-between items-center gap-3 w-full">
                    <AuthInput
                        id="city"
                        placeholder="City"
                        type="text"
                        label="CITY"
                        register={register("address.city")}
                        errorMessage={errors.address?.city?.message}
                    />

                    <AuthInput
                        id="pincode"
                        placeholder="Pincode"
                        type="text"
                        label="PINCODE / ZIP"
                        register={register("address.pincode")}
                        errorMessage={errors.address?.pincode?.message}
                    />
                </div>

                <div className="flex md:flex-row flex-col justify-between items-center gap-3 w-full">
                    <AuthInput
                        id="state"
                        placeholder="State"
                        type="text"
                        label="STATE / PROVINCE "
                        register={register("address.state")}
                        errorMessage={errors.address?.state?.message}
                    />

                    <div
                        ref={dropdownRef}
                        className="relative flex flex-col w-full gap-1.5">
                        <span className='text-text-sm font-bold text-[11px]'>COUNTRY</span>

                        <button
                            onClick={() => {
                                setIsDropdownOpen(prev => !prev)
                            }}
                            type="button"
                            className="flex items-center justify-between gap-2 border-text-sm border rounded-lg py-2.5 px-3 text-text-sm w-full text-sm cursor-pointer">
                            <span className="truncate">
                                {countryValue || "Select country"}
                            </span>

                            <HiChevronDown className={`${isDropdownOpen ? "rotate-180" : ""} transition-transform duration-200 shrink-0`} />
                        </button>

                        <p className="min-h-5 text-xs text-overdue">
                            {errors.address?.country?.message}
                        </p>

                        {isDropdownOpen &&
                            <div className="absolute bottom-full right-0 mt-2 w-64 rounded-lg border-[1.5px] border-border bg-card shadow-lg p-2 z-10">

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search country..."
                                    className="w-full border-[1.5px] border-border rounded-lg px-3 py-2 text-sm outline-none mb-2 text-text placeholder:text-text"
                                />

                                <div className="max-h-60 overflow-y-auto">
                                    {filteredCountries.map((country) => {
                                        const isSelected = countryValue === country.name
                                        return (
                                            <button
                                                onClick={() => {
                                                    setValue("address.country", country.name,
                                                        { shouldValidate: true }
                                                    )
                                                    setIsDropdownOpen(false)
                                                }}
                                                key={country.isoCode}
                                                type="button"
                                                className={`flex justify-between items-center w-full px-3 py-2 rounded-lg cursor-pointer ${isSelected ? "bg-navy-700 text-card" : "text-text"}`}
                                            >
                                                <span>{country.name}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                    </div>
                </div>


            </div>

        </div>
    )
}
