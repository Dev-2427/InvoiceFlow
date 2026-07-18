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

    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center w-full'>

      <div className="text-center space-y-1 mb-6">
        <h1 className='font-bold text-text text-2xl'>Create your account</h1>
        <span className='text-text-md text-sm sm:text-base'>Start managing your invoice for free</span>
      </div>

      <GoogleButton text="Sign up" />

      <div className="flex flex-col space-y- w-full">
        <div className="grid grid-cols-2 gap-3">

          <AuthInput id="firstName" placeholder="First name" type="text" label="FIRST NAME" register={register("firstName")} errorMessage={errors.firstName?.message} />

          <AuthInput id="lastName" placeholder="Last name" type="text" label="LAST NAME" register={register("lastName")} errorMessage={errors.lastName?.message} optional={true} />

        </div>


        <AuthInput id="country" placeholder="Country" register={register("country")} type="text" errorMessage={errors.country?.message} label="COUNTRY" optional={true} />

        <AuthInput id="email" placeholder="Email" register={register("email")} type="email" errorMessage={errors.email?.message} label="EMAIL" />

        <AuthInput id="password" placeholder="Password" register={register("password")} type="password" errorMessage={errors.password?.message} label="PASSWORD" />

      </div>


      <AuthButton disabled={isSigningUp} loadingText="Creating..." text="Create Account" />

      <div className="mt-5 flex justify-center gap-1 text-sm">        <p className="text-text-sm">Already have an account?</p>
        <button
          type="button"
          onClick={() => navigate("/signin")}
          className="text-navy-900 font-semibold cursor-pointer hover:underline transition-colors">Sign in</button>
      </div>

    </form>
  )
}
