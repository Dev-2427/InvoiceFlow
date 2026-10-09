import { useForm } from "react-hook-form";
import AuthInput from "../../../auth/AuthInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { organizationAddressSchema, type OrganizationAddressInput } from "../../../../validation/organizationValidation";
import type { Address } from "../../../../types/organization.types";

interface BusinessAddressProps {
    address: Address,
    isSavingAddress: boolean,
    handleAddressSubmit: (data: OrganizationAddressInput) => Promise<boolean>
}

export default function BusinessAddress({ address, handleAddressSubmit, isSavingAddress }: BusinessAddressProps) {

    const { register, reset, formState: { errors, isDirty }, handleSubmit } = useForm({
        resolver: zodResolver(organizationAddressSchema),
        defaultValues: {
            address: {
                street1: address.street1,
                street2: address.street2 ?? "",
                city: address.city,
                pincode: address.pincode,
                state: address.state,
                country: address.country,
            }
        }
    })

    async function onSubmit(data: OrganizationAddressInput) {
        const success = await handleAddressSubmit(data)

        if (success) {
            reset(data)
        }
    }

    return (
        <div className="px-5 space-y-5 max-w-2xl">

            {/* address details */}
            <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-4">

                {/* header */}
                <div>
                    <span className="text-text text-[15px] font-bold">Business Address</span>
                    <p className="text-[13px] text-text-sm">Printed on all your invoices

                    </p>
                </div>

                <hr className="border border-border/70" />

                {/* address form*/}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex flex-col items-center w-full">

                        {/* street 1 */}
                        <AuthInput
                            id="organizationName" placeholder="Street line 1 Name" type="text" label="STREET LINE 1 *"
                            register={register("address.street1")}
                            errorMessage={errors.address?.street1?.message}
                        />

                        {/* street 2 */}
                        <AuthInput
                            id="street2"
                            placeholder="Strret line 2"
                            type="text"
                            label="STREET LINE 2"
                            register={register("address.street2")}
                            errorMessage={errors.address?.street2?.message}
                        />

                        <div className="flex w-full gap-3 items-center">
                            {/* city*/}
                            <AuthInput
                                id="city"
                                placeholder="City"
                                type="text"
                                label="CITY *"
                                register={register("address.city")}
                                errorMessage={errors.address?.city?.message}
                            />

                            {/* state*/}
                            <AuthInput
                                id="state"
                                placeholder="State"
                                type="text"
                                label="STATE *"
                                register={register("address.state")}
                                errorMessage={errors.address?.state?.message}
                            />
                        </div>

                        <div className="flex w-full gap-3 items-center">
                            {/* pincode*/}
                            <AuthInput
                                id="pincode"
                                placeholder="Pincode"
                                type="text"
                                label="PINCODE *"
                                register={register("address.pincode")}
                                errorMessage={errors.address?.pincode?.message}
                            />

                            {/* country*/}
                            <AuthInput
                                id="country"
                                placeholder="Country"
                                type="text"
                                label="COUNTRY *"
                                register={register("address.country")}
                                errorMessage={errors.address?.country?.message}
                            />
                        </div>

                    </div>

                    <button
                        disabled={isSavingAddress || !isDirty}
                        type="submit"
                        className="bg-gold text-gold-dark hover:bg-gold/90 rounded-lg py-2.5 w-full text-[15px] font-bold cursor-pointer disabled:opacity-50 disabled:pointer-events-none">
                        {isSavingAddress ? "Saving..." : "Save Address"}
                    </button>

                </form>

            </div >

        </div >
    )
}
