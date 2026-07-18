import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type ForgotPasswordInput, forgotPasswordSchema } from "../../validation/authValidation";
import { useNavigate } from "react-router-dom";
import useAuth from "../../store/authStore"
import toast from "react-hot-toast";
import { HiKey } from "react-icons/hi2";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

export default function ForgotPassword() {


    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const forgotPassword = useAuth((state) => state.forgotPassword)
    const isSendingMail = useAuth((state) => state.isSendingMail)

    async function onSubmit(data: ForgotPasswordInput) {
        const res = await forgotPassword(data)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)

        navigate(`/verify-reset-code/${res.data.userId}`, { state: { email: data.email } })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center w-full'>

            <div className='flex flex-col justify-center items-center gap-2 mb-4'>

                <div className="flex justify-center items-center border-gold border-2 rounded-lg w-14 h-14 bg-gold-light">
                    <HiKey className="text-3xl text-gold" />
                </div>

                <h1 className='font-bold text-text text-[20px]'>Forgot password?</h1>
                <span className='text-text-md text-[13px] text-center'>No worries! Enter your email address and we'll send you a verification code to reset password.</span>
            </div>


            <div className="w-full">
                <AuthInput id="email" placeholder="Email" register={register("email")} type="email" errorMessage={errors.email?.message} label="EMAIL ADDRESS" />
            </div>



            <AuthButton disabled={isSendingMail} loadingText="Sending..." text="Send Email" />


            <div className="flex gap-1 mt-3 text-[14px]" >
                <p className="text-text-sm">Remember your password?</p>
                <button
                    type="button"
                    onClick={() => navigate("/signin")}
                    className="text-navy-900 font-semibold cursor-pointer">Sign in</button>
            </div>

        </form>
    )
}
