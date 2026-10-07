import React from "react";
import type { User } from "../../types/auth.types"
import toast from "react-hot-toast";
import userStore from "../../store/userStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type UpdateProfileSchemaInput } from "../../validation/user.validation";

interface ProfileProps {
    user: User
}

export default function Profile({ user }: ProfileProps) {

    const updateAvatar = userStore((state) => state.updateAvatar)
    const isUpdatingAvatar = userStore((state) => state.isUpdatingAvatar)
    const isUpdatingProfile = userStore((state) => state.isUpdatingProfile)
    const updateProfile = userStore((state) => state.updateProfile)

    async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]

        if (!file) return

        if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
            toast.error("Only JPG and PNG images are allowed.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Avatar must be smaller than 5MB.")
            return
        }

        const res = await updateAvatar(file)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    const { register, handleSubmit, formState: { errors, isDirty } } = useForm({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            country: user.country
        }
    })

    async function onSubmit(data: UpdateProfileSchemaInput) {

        const res = await updateProfile(data)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
    }

    return (
        <div className="px-5 space-y-5">

            {/* profile avatar */}
            <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-4">

                {/* header */}
                <div>
                    <span className="text-text text-[15px] font-bold">Profile Avatar</span>
                    <p className="text-[13px] text-text-sm">Your avatar shown across InvoiceFlow</p>
                </div>

                <hr className="border border-border/70" />

                {/* avatar, name and email */}
                <div className="flex items-center gap-3">

                    {user.avatar ?
                        <img
                            className="h-15 w-15 object-cover rounded-lg shrink-0"
                            src={user.avatar} />
                        :

                        <div className="flex justify-center items-center rounded-lg w-15 h-15 bg-gold text-gold-dark font-bold text-3xl shrink-0">
                            {user.firstName.charAt(0).toUpperCase()}
                        </div>
                    }

                    <div className="flex flex-col justify-center min-w-0">
                        <span className="text-text text-[15px] font-bold capitalize">{user.firstName} {user.lastName}</span>

                        <span className="text-[13px] text-text-sm break-all">{user.email}</span>

                        <label
                            htmlFor={isUpdatingAvatar ? undefined : "avatar"}
                            className={`border-[1.5px] border-border rounded-lg px-3 w-fit text-[13px] font-semibold text-text-md py-1.5 hover:bg-navy-50 my-1.5 ${isUpdatingAvatar ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
                        >
                            {isUpdatingAvatar ? "Uploading..." : "Upload Avatar"}
                        </label>

                        <input
                            id="avatar"
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={(e) => handleAvatarChange(e)}
                            className="hidden"
                        />

                        <span className="text-text-xs text-[10px] font-semibold">JPG or PNG · MAX 5MB</span>

                    </div>

                </div>

            </div>


            {/* personal details */}
            <div className="bg-card border-[1.5px] border-border rounded-[14px] px-5 py-3 space-y-4">

                {/* header */}
                <div>
                    <span className="text-text text-[15px] font-bold">Personal Details</span>
                    <p className="text-[13px] text-text-sm">Update your name and country</p>
                </div>

                <hr className="border border-border/70" />

                {/* details form*/}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex flex-col sm:flex-row items-center sm:gap-3">

                        {/* first name */}
                        <div className="flex flex-col gap-1 grow min-w-0 w-full">
                            <label htmlFor="firstName" className='text-text-sm font-bold text-[11px]'>FIRST NAME *</label>

                            <input
                                {...register("firstName")}
                                spellCheck={false}
                                className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] transition-all duration-200'
                                placeholder={"First name"} id="firstName" />

                            <p className="min-h-5 text-xs text-overdue">
                                {errors.firstName?.message}
                            </p>
                        </div>

                        {/* last name  */}
                        <div className="flex flex-col gap-1 grow min-w-0 w-full">
                            <label htmlFor="lastName" className='text-text-sm font-bold text-[11px]'>LAST NAME</label>

                            <input
                                {...register("lastName")}
                                spellCheck={false}
                                className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] transition-all duration-200'
                                placeholder={"Last name"} id="lastName" />

                            <p className="min-h-5 text-xs text-overdue">
                                {errors.lastName?.message}
                            </p>
                        </div>

                    </div>


                    {/* email */}
                    <div className="flex flex-col gap-1 grow min-w-0 w-full">
                        <label className='text-text-sm font-bold text-[11px]'>EMAIL</label>

                        <div className="relative">

                            <input
                                disabled
                                value={user.email}
                                className='border-border border-[1.5px] border-dashed rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] text-[13px] bg-page transition-all duration-200 w-full pr-10'
                            />
                            <span className="absolute top-1/2 -translate-y-1/2 right-3">🔒</span>
                        </div>

                        <p className="min-h-5 text-xs text-text-sm">
                            Your sign-up email cannot be changed. Contact support if needed.
                        </p>

                    </div>

                    {/* country */}
                    <div className="flex flex-col gap-1 grow min-w-0 w-full mt-4">
                        <label htmlFor="country" className='text-text-sm font-bold text-[11px]'>COUNTRY</label>

                        <input
                            {...register("country")}
                            spellCheck={false}
                            className='border-border border-[1.5px] rounded-lg py-2.5 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] transition-all duration-200'
                            placeholder={"Country"} id="country" />

                        <p className="min-h-5 text-xs text-overdue">
                            {errors.country?.message}
                        </p>
                    </div>

                    <button
                        disabled={isUpdatingProfile || !isDirty}
                        type="submit"
                        className="bg-gold text-gold-dark hover:bg-gold/90 rounded-lg py-2.5 w-full text-[15px] font-bold cursor-pointer disabled:opacity-50 disabled:pointer-events-none">
                        {isUpdatingProfile ? "Saving..." : "Save Changes"}
                    </button>
                </form>

            </div>


            {/* delete account */}
            <div className="bg-card border-[1.5px] border-overdue-border rounded-[14px] px-5 py-3 space-y-4">

                {/* header */}
                <div>
                    <span className="text-overdue text-[15px] font-bold">Danger Zone</span>
                    <p className="text-[13px] text-text-sm">Irreversible actions for your account</p>
                </div>

                <hr className="border border-border/70" />

                <p className="text-[13px] text-text-sm">Deleting your account will permanently remove all data including organisations, invoices and clients. This cannot be undone.</p>

                <button
                    type="button"
                    className="bg-overdue-bg text-overdue hover:bg-overdue-bg/90 rounded-lg py-2.5 w-full text-sm font-semibold cursor-pointer border-[1.5px] ">
                    Delete My Account
                </button>
            </div>

        </div>
    )
}
