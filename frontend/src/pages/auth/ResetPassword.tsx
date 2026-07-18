import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type ResetPasswordInput, resetPasswordSchema } from "../../validation/authValidation"
import authStore from "../../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HiArrowLeft, HiLockClosed } from "react-icons/hi";

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

      <div className='flex flex-col justify-center items-center gap-2 mb-4'>

        <div className="flex justify-center items-center border-gold border-2 rounded-lg w-14 h-14 bg-gold-light">
          <HiLockClosed className="text-3xl text-gold" />
        </div>

        <h1 className='font-bold text-text text-[20px]'>Set new password</h1>
        <span className='text-text-md text-[13px]'>Your password must be different form previous one.</span>
      </div>

      <div className="flex flex-col gap-1 w-full">

        <div className="flex flex-col gap-1.5">
          <label htmlFor="newPassword" className='text-text-sm font-bold text-[11px]'>NEW PASSWORD</label>
          <input {...register("password")}
            className='border-text-sm border rounded-lg py-2 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-sm text-[13px]'
            placeholder='New password'
            type="password" id="newPassword" />

          <p className="min-h-5 text-xs text-red-500">
            {errors.password?.message}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className='text-text-sm font-bold text-[11px]'>CONFIRM NEW PASSWORD</label>
          <input {...register("confirmPassword")}
            className='border-text-sm border rounded-lg py-2 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-sm text-[13px]'
            placeholder='New password'
            type="password" id="confirmPassword" />

          <p className="min-h-5 text-xs text-red-500">
            {errors.confirmPassword?.message}
          </p>
        </div>

      </div>


      <button
        type="submit"
        disabled={isResettingPassword}
        className="bg-gold text-gold-dark text-[14px] mt-5 w-full rounded-lg py-2.5 cursor-pointer font-bold disabled:opacity-60 disabled:cursor-not-allowed">{isResettingPassword ? "Resetting..." : "Reset Password"}
      </button>

      <button
        type="button"
        onClick={() => navigate("/signin")}
        className="flex cursor-pointer items-center gap-1 mt-3">

        <HiArrowLeft className="text-text-sm" />
        <p className="text-text-sm text-[14px] font-semibold">Go back to sign in</p>
      </button>

    </form>
  )
}
