import toast from "react-hot-toast"
import organizationStore from "../../../store/organizationStore"
import type { organizationData } from "../../../types/organization.types"
import OrganizationLogoAndPersonalDetails from "./components/OrganizationLogoAndPersonalDetails"
import type { UpdateOrganizationInput } from "../../../validation/organizationValidation"

interface OrganizationProp {
    organization: organizationData
}

export default function Organization({ organization }: OrganizationProp) {

    const updateOrganizationLogo = organizationStore((state) => state.updateOrganizationLogo)
    const isUpdatingLogo = organizationStore((state) => state.isUpdatingLogo)
    const removeOrganizationLogo = organizationStore((state) => state.removeOrganizationLogo)
    const isUpdatingOrganizationData = organizationStore((state) => state.isUpdatingOrganizationData)
    const updateOrganization = organizationStore((state) => state.updateOrganization)

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

    async function onPersonalDetailsSubmit(data: UpdateOrganizationInput) {
        const res = await updateOrganization(organization._id, data)

        if (!res.success) {
            toast.error(res.message)
            return false
        }

        toast.success(res.message)
        return true
    }

    return (
        <>
            <OrganizationLogoAndPersonalDetails
                organization={organization}
                isUpdatingLogo={isUpdatingLogo}
                handleLogoChange={(e) => handleLogoChange(e)}
                handleRemoveLogo={handleRemoveLogo}
                isUpdatingOrganizationData={isUpdatingOrganizationData}
                onPersonalDetailsSubmit={(data) => onPersonalDetailsSubmit(data)}
            />
        </>
    )
}
