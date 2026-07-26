import { useFormContext } from "react-hook-form";
import AuthInput from "../../auth/AuthInput";
import type { CreateOrganizationInput } from "../../../validation/organizationValidation";
import { Country } from "country-state-city";
import { useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

export default function BasicInfo() {

    const { register, watch, setValue, formState: { errors } } = useFormContext<CreateOrganizationInput>()
    const phoneCode = watch("phoneCode");

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const countries = Country.getAllCountries()

    const [search, setSearch] = useState("")
    const filteredCountries = countries.filter((country) => country.name.toLowerCase().includes(search.toLowerCase()))

    const dropdownRef = useRef<HTMLDivElement>(null)

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


    return (
        <div className="flex flex-col items-center gap-5">

            <div className="flex items-center self-start gap-2">
                <div className="flex justify-center items-center w-7 h-7 bg-navy-50 text-navy-700 font-semibold rounded-full">
                    1
                </div>
                <p className="font-semibold text-navy-700">Basic Info</p>
            </div>


            <div className="flex flex-col items-center w-full">
                <AuthInput
                    id="organizationName" placeholder="Organization Name" type="text" label="ORGANIZATION NAME"
                    register={register("organizationName")}
                    errorMessage={errors.organizationName?.message}
                />

                <AuthInput
                    id="email"
                    placeholder="Email"
                    type="text"
                    label="BUSINESS EMAIL"
                    register={register("email")}
                    errorMessage={errors.email?.message}
                />


                <div className="flex flex-col items-center gap-1.5 w-full">

                    <div className="flex self-start gap-1">
                        <label
                            htmlFor="phone"
                            className="text-text-sm font-bold text-[11px]"
                        >
                            PHONE NUMBER
                        </label>

                        <span className="text-text-sm font-semibold text-[11px]">
                            (Optional)
                        </span>
                    </div>

                    <div
                        ref={dropdownRef}
                        className="relative flex gap-1.5 w-full">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(prev => !prev)}
                            className="flex items-center gap-2 min-w-15 border border-text-sm rounded-lg py-2.5 px-3 h-10 text-text-sm text-sm cursor-pointer"
                        >
                            {phoneCode}
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
                                        const isSelected = phoneCode === `+${country.phonecode}`;

                                        return (
                                            < button
                                                onClick={() => {
                                                    setIsDropdownOpen(false)
                                                    setValue("phoneCode", `+${country.phonecode}`, {
                                                        shouldValidate: true
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
                            className='border-text-sm border rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] w-full text-sm transition-all duration-200'
                            placeholder="Phone"
                            type="tel" id="phone" />
                    </div>
                    <p className="min-h-5 text-xs text-overdue">
                        {errors.phone?.message}
                    </p>
                </div>

                <AuthInput
                    id="gstNumber"
                    placeholder="Number"
                    type="text"
                    label="GST / TAX NUMBER"
                    optional={true}
                    register={register("gstNumber")}
                    errorMessage={errors.gstNumber?.message}
                />

            </div>

        </div >
    )
}
