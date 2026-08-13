import type { CreateOrganizationInput } from "../../../validation/organizationValidation"
import { useFormContext, useWatch } from "react-hook-form";
import { HiLockClosed } from "react-icons/hi2";

export default function Review() {

    const { control } = useFormContext<CreateOrganizationInput>()

    const values = useWatch({ control })

    return (
        <div className="flex flex-col items-center gap-5">

            <div className="flex items-center self-start gap-2">
                <div className="flex justify-center items-center w-7 h-7 bg-navy-50 text-navy-700 font-semibold rounded-full">
                    4
                </div>
                <p className="font-semibold text-navy-700">Review & Confirm</p>
            </div>

            {/* details box  */}

            <div className="flex items-center gap-2 p-5 bg-navy-700 rounded-lg w-full">
                <div className="flex justify-center items-center w-10 h-10 bg-gold text-gold-dark rounded-lg text-2xl font-bold">
                    {values.organizationName?.charAt(0).toUpperCase()}
                </div>

                <div className="flex flex-col items-start overflow-hidden">
                    <p className="text-page font-bold text-md">{values.organizationName}</p>
                    <p className="text-navy-200 text-sm">{values.address?.state}, {values.address?.country}</p>
                </div>
            </div>


            {/* information card */}
            <div className="flex flex-col items-center w-full bg-page p-5 rounded-lg gap-3">
                <span className="font-bold text-text-sm text-[10px] self-start">BASIC INFO</span>

                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">Organization Name</span>
                    <span className="text-text font-bold text-[12px]">{values.organizationName}</span>
                </div>

                <hr className="border border-border w-full" />

                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">Email</span>
                    <span className="text-text font-bold text-[12px]">{values.email}</span>
                </div>

                <hr className="border border-border w-full" />

                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">Phone</span>
                    <span className="text-text font-bold text-[12px]">{values.phone || "—"}</span>
                </div>

                <hr className="border border-border w-full" />

                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">GST / Tax.No.</span>
                    <span className="text-text font-bold text-[12px]">{values.gstNumber || "—"}</span>
                </div>

                <hr className="border border-border w-full" />


                <span className="font-bold text-text-sm text-[10px] self-start">ADDRESS</span>

                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">Street 1</span>
                    <span className="text-text font-bold text-[12px]">{values.address?.street1}</span>
                </div>

                <hr className="border border-border w-full" />

                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">Street 2</span>
                    <span className="text-text font-bold text-[12px]">{values.address?.street2 || "—"}</span>
                </div>

                <hr className="border border-border w-full" />

                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">City</span>
                    <span className="text-text font-bold text-[12px]">{values.address?.city}</span>
                </div>

                <hr className="border border-border w-full" />


                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">Pincode</span>
                    <span className="text-text font-bold text-[12px]">{values.address?.pincode}</span>
                </div>

                <hr className="border border-border w-full" />


                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">State</span>
                    <span className="text-text font-bold text-[12px]">{values.address?.state}</span>
                </div>

                <hr className="border border-border w-full" />


                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">Country</span>
                    <span className="text-text font-bold text-[12px]">{values.address?.country}</span>
                </div>

                <hr className="border border-border w-full" />


                <span className="font-bold text-text-sm text-[10px] self-start">CURRENCY & TERMS</span>


                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">CURRENCY</span>
                    <span className="text-text font-bold text-[12px]">{values.currencyCode}</span>
                </div>

                <hr className="border border-border w-full" />

                <div className="flex justify-between items-center w-full">
                    <span className="text-text-sm text-[12px] font-semibold">Invoice Terms</span>
                    <span className="text-text font-bold text-[12px]">
                        {
                            values.termsAndConditions ?
                                (values.termsAndConditions.length > 10 ? values.termsAndConditions.slice(0, 10) + "..." : values.termsAndConditions) : "—"}</span>
                </div>

                <hr className="border border-border w-full" />



            </div>


            <div className="flex items-start gap-2 border-unpaid-border border-[1.5px] rounded-xl bg-unpaid-bg text-unpaid p-5">
                <HiLockClosed size={20} />

                <p className="text-[12px]">
                    <span className="font-bold">Currency ({values.currencyCode}) cannot be changed</span> after creating the organisation. All invoices will use {values.currencyCode}.
                </p>

            </div>


        </div>
    )
}
