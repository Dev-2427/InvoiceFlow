import toast from "react-hot-toast"
import organizationStore from "../../../store/organizationStore"
import type { organizationData } from "../../../types/organization.types"
import OrganizationLogoAndPersonalDetails from "./components/OrganizationLogoAndPersonalDetails"
import type { OrganizationAddressInput, UpdateOrganizationInput } from "../../../validation/organizationValidation"
import BusinessAddress from "./components/BusinessAddress"
import SwitchOrganization from "./components/SwitchOrganization"
import { useNavigate } from "react-router-dom"

interface OrganizationProp {
    organization: organizationData
}

export default function Organization({ organization }: OrganizationProp) {

    const updateOrganizationLogo = organizationStore((state) => state.updateOrganizationLogo)
    const isUpdatingLogo = organizationStore((state) => state.isUpdatingLogo)
    const removeOrganizationLogo = organizationStore((state) => state.removeOrganizationLogo)
    const isUpdatingOrganizationData = organizationStore((state) => state.isUpdatingOrganizationData)
    const isUpdatingOrganizationAddress = organizationStore((state) => state.isUpdatingOrganizationAddress)
    const updateOrganization = organizationStore((state) => state.updateOrganization)
    const isGettingAllOrganizations = organizationStore((state) => state.isGettingAllOrganizations)
    const getAllOrganizations = organizationStore((state) => state.getAllOrganizations)
    const allOrganizations = organizationStore((state) => state.allOrganizations)
    const switchOrganization = organizationStore((state) => state.switchOrganization)
    const switchingOrganizationId = organizationStore((state) => state.switchingOrganizationId)

    const navigate = useNavigate()

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

    async function handleOrganizationUpdate(data: UpdateOrganizationInput | OrganizationAddressInput) {
        const res = await updateOrganization(organization._id, data)

        if (!res.success) {
            toast.error(res.message)
            return false
        }

        toast.success(res.message)
        return true
    }

    async function fetchAllOrganizations() {
        const res = await getAllOrganizations()

        if (!res.success) {
            toast.error(res.message)
        }
    }

    async function handleSwitchOrganization(organisationId: string) {
        const res = await switchOrganization(organisationId)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
        navigate("/dashboard", { replace: true })
    }

    return (
        <>
            <OrganizationLogoAndPersonalDetails
                organization={organization}
                isUpdatingLogo={isUpdatingLogo}
                handleLogoChange={(e) => handleLogoChange(e)}
                handleRemoveLogo={handleRemoveLogo}
                isUpdatingOrganizationData={isUpdatingOrganizationData}
                onPersonalDetailsSubmit={(data) => handleOrganizationUpdate(data)}
            />

            <BusinessAddress
                address={organization.address}
                handleAddressSubmit={(data) => handleOrganizationUpdate(data)}
                isSavingAddress={isUpdatingOrganizationAddress}
            />

            <SwitchOrganization
                getAllOrganizations={fetchAllOrganizations}
                isGettingAllOrganizations={isGettingAllOrganizations}
                allOrganizations={allOrganizations}
                currentOrganization={organization}
                switchOrganization={(organizationId) => handleSwitchOrganization(organizationId)}
                switchingOrganizationId={switchingOrganizationId}
            />
        </>
    )
}
