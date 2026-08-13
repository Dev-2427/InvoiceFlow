import organizationStore from "../store/organizationStore";

export default function useOrganization() {

    const organization = organizationStore((state) => state.organization)

    if (!organization) {
        throw new Error("Organization is not available");
    }

    return organization
}
