import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { changePasswordSchema, type ChangePasswordInput } from "../../validation/authValidation"
import authStore from "../../store/authStore"
import toast from "react-hot-toast"

export default function Password() {

    const isChangingPassword = authStore((state) => state.isChangingPassword)
    const changePassword = authStore((state) => state.changePassword)

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(changePasswordSchema)
    })

    async function onSubmit(data: ChangePasswordInput) {
        const res = await changePassword(data)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    return (
        <div className="px-5 pb-5 max-w-2xl">
            <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-4">

                {/* header */}
                <div>
                    <span className="text-text text-[15px] font-bold">Change Password</span>
                    <p className="text-[13px] text-text-sm">Use a strong password with at least 8 characters</p>
                </div>

                <hr className="border border-border/70" />

                {/*form*/}
                <form onSubmit={handleSubmit(onSubmit)}>

                    {/* old password */}
                    <div className="flex flex-col gap-1 grow min-w-0 w-full">
                        <label htmlFor="oldPassword" className='text-text-sm font-bold text-[11px]'>CURRENT PASSWORD</label>

                        <input
                            {...register("oldPassword")}
                            spellCheck={false}
                            type="password"
                            className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] transition-all duration-200'
                            placeholder={"Enter current password"} id="oldPassword" />

                        <p className="min-h-5 text-xs text-overdue">
                            {errors.oldPassword?.message}
                        </p>
                    </div>

                    {/* new password  */}
                    <div className="flex flex-col gap-1 grow min-w-0 w-full">
                        <label htmlFor="newPassword" className='text-text-sm font-bold text-[11px]'>NEW PASSWORD</label>

                        <input
                            {...register("newPassword")}
                            spellCheck={false}
                            type="password"
                            className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] transition-all duration-200'
                            placeholder={"Min. 8 characters"} id="newPassword" />

                        <p className="min-h-5 text-xs text-overdue">
                            {errors.newPassword?.message}
                        </p>
                    </div>

                    {/* confirm new password */}
                    <div className="flex flex-col gap-1 grow min-w-0 w-full mt-4">
                        <label htmlFor="confirmNewPassword" className='text-text-sm font-bold text-[11px]'>CONFIRM NEW PASSWORD</label>

                        <input
                            {...register("confirmNewPassword")}
                            spellCheck={false}
                            type="password"
                            className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] transition-all duration-200'
                            placeholder={"Re-enter new password"} id="confirmNewPassword" />

                        <p className="min-h-5 text-xs text-overdue">
                            {errors.confirmNewPassword?.message}
                        </p>
                    </div>

                    <button
                        disabled={isChangingPassword}
                        type="submit"
                        className="bg-navy-700 text-card hover:bg-navy-700/90 rounded-lg py-2.5 w-full text-[15px] font-bold cursor-pointer disabled:opacity-50 disabled:pointer-events-none">
                        {isChangingPassword ? "Updating..." : "Update Password"}
                    </button>
                </form>

            </div>
        </div>
    )
}
