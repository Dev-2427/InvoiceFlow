import { forwardRef } from "react";
import { HiArrowLeftOnRectangle } from "react-icons/hi2";

interface IUserContextMenuData {
    firstName: string,
    lastName: string,
    email: string
}

const UserContextMenu = forwardRef<HTMLDivElement, IUserContextMenuData>(
    ({ firstName, lastName, email }, ref) => {


        return (
            <div
                ref={ref}
                className="absolute top-full right-0 mx-5 flex flex-col bg-card rounded-xl overflow-auto min-w-64">
                <div className="flex items-center gap-2 bg-page w-full p-4 border-b border-b-border">
                    <div className="flex justify-center items-center bg-gold text-gold-dark rounded-full font-bold text-xl w-9 h-9">
                        {firstName.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex flex-col items-start text-sm">
                        <span className="font-bold text-text">{firstName} {lastName}</span>
                        <span className="text-text-sm">{email}</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="flex items-center text-overdue cursor-pointer gap-1 hover:bg-overdue-bg w-full p-4">
                    < HiArrowLeftOnRectangle className="text-xl" />
                    <span className="font-bold text-sm">Sign out</span>
                </button>
            </div>
        )
    }
)


export default UserContextMenu