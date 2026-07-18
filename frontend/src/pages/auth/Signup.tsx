import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signupSchema, type SignupInput } from "../../validation/authValidation"
import { FcGoogle } from "react-icons/fc";
import authStore from "../../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(signupSchema) })

  const signup = authStore((state) => state.signup)
  const isSigningUp = authStore((state) => state.isSigningUp)

  const navigate = useNavigate()

  async function onSubmit(data: SignupInput) {
    const res = await signup(data)

    if (!res.success) {
      toast.error(res.message)
      return
    }

    toast.success(res.message)
    navigate(`/verify-code/${res.data.userId}`, { state: { email: data.email } })
  }

  return (

    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center'>

      <div className='flex flex-col justify-center items-center gap-1'>
        <h1 className='font-bold text-text text-[20px]'>Create your account</h1>
        <span className='text-text-md text-[15px]'>Start managing your invoice for free</span>
      </div>

      <div className='flex justify-center items-center gap-2 my-5 border-text-sm border w-full rounded-2xl py-2 cursor-pointer'>
        <FcGoogle size={20} />
        <span className='text-text font-semibold text-[14px]'>Sign up with Google</span>
      </div>


      <div className="flex justify-between items-center gap-1 w-full mb-5">
        <hr className='border-text-sm  w-full' />
        <span className='text-text-sm text-sm font-semibold'>OR</span>
        <hr className='border-text-sm w-full' />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-center items-center gap-3">

          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className='text-text-sm font-bold text-[11px]'>FIRST NAME</label>
            <input {...register("firstName")}
              className='border-text-sm border rounded-lg py-2 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm w-40 text-[13px]'
              placeholder='John'
              type="text" id="firstName" />

            <p className="min-h-5 text-xs text-red-500">
              {errors.firstName?.message}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
              <label htmlFor="lastName" className='text-text-sm font-bold text-[11px]'>LAST NAME</label>

              <span className="text-text-sm font-semibold text-[11px]">(Optional)</span>
            </div>
            <input {...register("lastName")}
              className='border-text-sm border rounded-lg py-2 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm w-40 text-sm text-[13px]'
              placeholder='Doe'
              type="text" id="lastName" />

            <p className="min-h-5 text-xs text-red-500">
              {errors.lastName?.message}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex gap-1">
            <label htmlFor="country" className='text-text-sm font-bold text-[11px]'>COUNTRY</label>

            <span className="text-text-sm font-semibold text-[11px]">(Optional)</span>
          </div>
          <input {...register("country")}
            className='border-text-sm border rounded-lg py-2 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-sm text-[13px]'
            placeholder='Country'
            type="text" id="country" />

          <p className="min-h-5 text-xs text-red-500">
            {errors.country?.message}
          </p>
        </div>


        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className='text-text-sm font-bold text-[11px]'>EMAIL</label>
          <input {...register("email")}
            className='border-text-sm border rounded-lg py-2 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-sm text-[13px]'
            placeholder='Email'
            type="email" id="email" />

          <p className="min-h-5 text-xs text-red-500">
            {errors.email?.message}
          </p>
        </div>


        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className='text-text-sm font-bold text-[11px]'>PASSWORD</label>
          <input {...register("password")}
            className='border-text-sm border rounded-lg py-2 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-sm text-[13px]'
            placeholder='Password'
            type="password" id="password" />

          <p className="min-h-5 text-xs text-red-500">
            {errors.password?.message}
          </p>
        </div>

      </div>


      <button
        type="submit"
        disabled={isSigningUp}
        className="bg-gold text-gold-dark text-[14px] mt-5 w-full rounded-lg py-2.5 cursor-pointer font-bold disabled:opacity-60 disabled:cursor-not-allowed">{isSigningUp ? "Creating..." : "Create Account"}
      </button>

      <div className="flex gap-1 mt-3 text-[14px]" >
        <p className="text-text-sm">Already have an account?</p>
        <button
          type="button"
          onClick={() => navigate("/signin")}
          className="text-navy-900 font-semibold cursor-pointer">Sign in</button>
      </div>

    </form>
  )
}
