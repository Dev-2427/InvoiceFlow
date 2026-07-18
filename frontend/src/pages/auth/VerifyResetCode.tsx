import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifyCodeSchema, type VerifyCodeInput } from "../../validation/authValidation";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../store/authStore"
import toast from "react-hot-toast";
import { useEffect } from "react"
import { HiOutlineEnvelope, HiArrowLeft } from "react-icons/hi2";
import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";

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
                    <HiOutlineEnvelope className="text-3xl text-gold" />
                </div>

                <h1 className='font-bold text-text text-[20px]'>Check your email</h1>
                <span className='text-text-md text-[13px]'>We sent a 6-digit verification code to</span>

                <span className='text-navy-900 text-[13px] font-bold text-sm'>{email}</span>

            </div>

            <div className="w-full">
                <AuthInput id="code" placeholder="Enter 6-digit code" register={register("verificationCode")} type="text" errorMessage={errors.verificationCode?.message} />
            </div>


            <AuthButton disabled={isVerifyingResetCode} loadingText="Verifying..." text="Verify Code" />


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
