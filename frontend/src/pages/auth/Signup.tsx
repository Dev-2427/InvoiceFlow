import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signupSchema, type SignupInput } from "../../validation/authValidation"
import authStore from "../../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";
import GoogleButton from "../../components/auth/GoogleButton";

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

      <GoogleButton text="Sign up" />

      <div className="flex flex-col gap-1">
        <div className="flex justify-center items-center gap-3">

          <AuthInput id="firstName" placeholder="First name" type="text" label="FIRST NAME" register={register("firstName")} errorMessage={errors.firstName?.message} />

          <AuthInput id="lastName" placeholder="Last name" type="text" label="LAST NAME" register={register("lastName")} errorMessage={errors.lastName?.message} optional={true} />

        </div>


        <AuthInput id="country" placeholder="Country" register={register("country")} type="text" errorMessage={errors.country?.message} label="COUNTRY" optional={true} />

        <AuthInput id="email" placeholder="Email" register={register("email")} type="email" errorMessage={errors.email?.message} label="EMAIL" />

        <AuthInput id="password" placeholder="Password" register={register("password")} type="password" errorMessage={errors.password?.message} label="PASSWORD" />

      </div>


      <AuthButton disabled={isSigningUp} loadingText="Creating..." text="Create Account" />

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
