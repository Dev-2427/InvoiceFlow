import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifyCodeSchema, type VerifyCodeInput } from "../../validation/authValidation";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../store/authStore"
import toast from "react-hot-toast";
import { useEffect } from "react"
import { HiOutlineEnvelope, HiArrowLeft } from "react-icons/hi2";

export default function VerifyResetCode() {

    const { userId } = useParams()
    const { state } = useLocation()
    const email = state?.email

    const navigate = useNavigate()

    useEffect(() => {
        if (!userId || !email) {
            navigate("/signin")
        }
    }, [userId, email, navigate])


    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(verifyCodeSchema),
        defaultValues: { userId }
    })

    const verifyResetCode = useAuth((state) => state.verifyResetCode)
    const isVerifyingResetCode = useAuth((state) => state.isVerifyingResetCode)

    async function onSubmit(data: VerifyCodeInput) {
        const res = await verifyResetCode(data)

        if (!res.success) {
            toast.error(res.message)
            return
        } else {
            toast.success(res.message)
            navigate("/reset-password")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center w-full'>

            <div className='flex flex-col justify-center items-center gap-2 mb-4'>

                <div className="flex justify-center items-center border-gold border-2 rounded-lg w-14 h-14 bg-gold-light">
                    <HiOutlineEnvelope className="text-3xl text-blue-400" />
                </div>

                <h1 className='font-bold text-text text-[20px]'>Check your email</h1>
                <span className='text-text-md text-[13px]'>We sent a 6-digit verification code to</span>

                <span className='text-navy-900 text-[13px] font-bold'>{email}</span>

            </div>


            <div className="flex flex-col gap-1 w-full">
                <input {...register("verificationCode")}
                    className='border-text-sm border rounded-lg py-2 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-sm text-[13px]'
                    placeholder='Code' maxLength={6}
                    type="text" />

                <p className="min-h-5 text-xs text-red-500">
                    {errors.verificationCode?.message}
                </p>
            </div>



            <button
                type="submit"
                disabled={isVerifyingResetCode}
                className="bg-gold text-gold-dark text-[14px] w-full rounded-lg py-2.5 cursor-pointer font-bold disabled:opacity-60 disabled:cursor-not-allowed">{isVerifyingResetCode ? "Verifying..." : "Verify Email"}
            </button>


            <hr className='border-text-sm border-1.0 w-full my-5 opacity-50' />

            <button
                type="button"
                onClick={() => navigate("/signin")}
                className="flex cursor-pointer items-center gap-1">

                <HiArrowLeft className="text-text-sm" />
                <p className="text-text-sm text-[14px] font-semibold">Go back to sign in</p>
            </button>

        </form>
    )
}
