import clientStore from "../store/clientStore"

export default function useClientOverviewData() {

    const clientOverviewData = clientStore((state) => state.clientOverviewData)

    if (!clientOverviewData) {
        throw new Error("Client overview data not found")
    }

    return clientOverviewData
}
