import { create } from "zustand";
import type { ClientFilterType, IClientSort } from "../types/clientTypes";

interface IClientStore {
    clientSort: IClientSort,
    clientFilter: ClientFilterType,
    clientSearch: string,

    setClientSortAndOrder: (sort: IClientSort) => void,
    setClientFilter: (filter: ClientFilterType) => void,
    setClientSearch: (text: string) => void
}

const clientStore = create<IClientStore>((set) => ({
    clientSort: {
        label: "Created (Newest)",
        order: "desc",
        sort: "createdAt"
    },
    clientFilter: "All",
    clientSearch: "",

    setClientSortAndOrder(sort) {
        set({ clientSort: sort })
    },

    setClientFilter(filter) {
        set({ clientFilter: filter })
    },

    setClientSearch(text) {
        set({ clientSearch: text })
    },
}))

export default clientStore