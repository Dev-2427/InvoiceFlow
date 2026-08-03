import { HiBars3 } from "react-icons/hi2";
import uiStore from "../../store/uiStore";

interface HeaderProps {
    header: string,
}

export default function Header({ header }: HeaderProps) {

    const openSidebar = uiStore((state) => state.openSidebar)

    return (
        <header className="lg:hidden flex items-center gap-3 bg-card w-full h-14 px-5 border-b border-border">
            <button
                type="button"
                onClick={() => openSidebar()}
                className="flex h-8 w-8 justify-center items-center lg:hidden cursor-pointer"
            >
                <HiBars3 className="text-2xl text-text" />
            </button>

            <p className="text-lg font-bold leading-none text-text">{header}</p>
        </header>)
}
