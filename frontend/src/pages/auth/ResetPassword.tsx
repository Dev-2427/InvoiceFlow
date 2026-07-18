import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type ResetPasswordInput, resetPasswordSchema } from "../../validation/authValidation"
import authStore from "../../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiLockClosed } from "react-icons/hi";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

export default function ResetPassword() {

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(resetPasswordSchema) })

  const resetPassword = authStore((state) => state.resetPassword)
  const isResettingPassword = authStore((state) => state.isResettingPassword)

  const navigate = useNavigate()

  async function onSubmit(data: ResetPasswordInput) {
    const res = await resetPassword(data)

    if (!res.success) {
      toast.error(res.message)
      return
    }

    toast.success(res.message)
    navigate("/signin")
  }

  return (

    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center w-full'>

      <div className='flex flex-col justify-center items-center gap-2 mb-6'>

        <div className="flex justify-center items-center border-gold border-2 w-16 h-16 rounded-2xl bg-gold-light">
          <HiLockClosed className="text-3xl text-gold" />
        </div>

        <h1 className='font-bold text-text text-[20px]'>Set new password</h1>
        <span className='text-text-md text-sm max-w-xs text-center'>Your password must be different from your previous password.</span>
      </div>

      <div className="w-full space-y-2">
        <AuthInput id="newPassword" placeholder="New password" register={register("password")} type="password" errorMessage={errors.password?.message} label="NEW PASSWORD" />

        <AuthInput id="confirmPassword" placeholder="Re-enter your password" register={register("confirmPassword")} type="password" errorMessage={errors.confirmPassword?.message} label="CONFIRM PASSWORD" />

      </div>


      <AuthButton disabled={isResettingPassword} loadingText="Resetting..." text="Reset Password" />

      <button
        type="button"
        onClick={() => navigate("/signin")}
        className="flex cursor-pointer items-center gap-1 mt-5">

        <HiArrowLeft className="text-text-sm" />
        <p className="text-text-sm text-[14px] font-semibold">Go back to sign in</p>
      </button>

    </form>
  )
}
