import clientStore from "../../store/clientStore"

interface SearchedClientListProps {
    onClientSelect: (clientId: string) => void
}

export default function SearchedClientList({ onClientSelect }: SearchedClientListProps) {

    const searchedClients = clientStore((state) => state.searchedClients)
    const handleSearchedClientClick = clientStore((state) => state.handleSearchedClientClick)

    return (
        <div className="absolute left-0 top-full border-[1.5px] border-border rounded-lg bg-card shadow-2xl max-h-52 overflow-y-auto w-full z-50">
            {
                searchedClients?.map((client) => (
                    <button
                        onClick={() => {
                            handleSearchedClientClick(client)
                            onClientSelect(client._id)
                        }
                        }
                        key={client._id}
                        type="button"
                        className="flex flex-col items-start cursor-pointer text-sm w-full border-b border-border px-5 py-3">
                        <span className="font-semibold text-text">{client.displayName}</span>
                        <span className="text-text-sm"> {client.companyName ?? "_"}</span>
                    </button>
                ))
            }
        </div>
    )
}
