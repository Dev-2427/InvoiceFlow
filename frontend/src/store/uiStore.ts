import { create } from "zustand";

interface UIStore {
    isSidebarOpen: boolean,
    openSidebar: () => void,
    closeSidebar: () => void

    isSidebarCollapsed: boolean,
    toggleSidebarCollapsed: () => void
}

const uiStore = create<UIStore>((set) => ({
    isSidebarOpen: false,

    isSidebarCollapsed: false,

    openSidebar() {
        set({ isSidebarOpen: true })
    },

    closeSidebar() {
        set({ isSidebarOpen: false })
    },

    toggleSidebarCollapsed() {
        set((state) => ({
            isSidebarCollapsed: !state.isSidebarCollapsed
        }))
    }
}))

export default uiStore