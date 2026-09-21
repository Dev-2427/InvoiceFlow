import { useEffect, useRef, useState } from "react"
import { TbPlus } from "react-icons/tb"
import CreateOptionsMenu from "./CreateOptionsMenu"

interface PageHeaderProps {
    organizationName: string
}

export default function DashboardHeader({ organizationName }: PageHeaderProps) {

    const [showCreateOptions, setShowCreateOptions] = useState(false)

    const createOptionsRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        function handleOutsideClick(e: MouseEvent) {
            if (!createOptionsRef.current || !createOptionsRef.current.contains(e.target as Node)) {
                setShowCreateOptions(false)
            }
        }

        document.addEventListener("mousedown", handleOutsideClick)
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick)
        }
    }, [])


    function getCurrentMonthAndYear(date: string) {
        return new Date(date).toLocaleDateString(undefined, {
            month: "short",
            year: "numeric"
        })
    }

    const today = new Date().toString()

    return (
        <div className="px-5 pt-4">
            <div className="flex justify-between items-center">

                <span className="text-text text-[22px] font-bold">Hello 👋</span>

                <div
                    ref={createOptionsRef}
                    className="relative">
                    <button
                        type="button"
                        onClick={() => setShowCreateOptions(prev => !prev)}
                        className="flex items-center gap-1 bg-gold text-gold-dark px-4 py-2 text-[14px] rounded-lg font-bold cursor-pointer hover:bg-gold/90"
                    >
                        <TbPlus />
                        <span>Create</span>
                    </button>

                    {
                        showCreateOptions &&
                        <CreateOptionsMenu />
                    }
                </div>

            </div>

            <span className="text-[14px] text-text-sm">{organizationName} — {getCurrentMonthAndYear(today)}
            </span>
        </div>
    )
}