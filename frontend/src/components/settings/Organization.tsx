import toast from "react-hot-toast"
import organizationStore from "../../store/organizationStore"
import { updateOrganizationSchema } from "../../validation/organizationValidation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { organizationData } from "../../types/organization.types"

interface OrganizationProp {
    organization: organizationData
}

export default function Organization({ organization }: OrganizationProp) {

    const updateOrganizationLogo = organizationStore((state) => state.updateOrganizationLogo)
    const isUpdatingLogo = organizationStore((state) => state.isUpdatingLogo)
    const removeOrganizationLogo = organizationStore((state) => state.removeOrganizationLogo)

    const [countryCode, phoneNumber] = organization.phone?.split(" ") ?? []

    const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
        resolver: zodResolver(updateOrganizationSchema),
        defaultValues: {
            organizationName: organization.organizationName,
            email: organization.email,
            gstNumber: organization.gstNumber ?? "",
            termsAndConditions: organization.termsAndConditions,
            phoneCode: countryCode ?? "+91",
            phone: phoneNumber ?? ""
        }
    })

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



        </div>
    )
}
