import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signinSchema, type SigninInput } from "../../validation/authValidation";
import authStore from "../../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import GoogleButton from "../../components/auth/GoogleButton";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

export default function Signin() {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(signinSchema)
    })

    const navigate = useNavigate()

    const signin = authStore((state) => state.signin)
    const isSigningIn = authStore((state) => state.isSigningIn)

    async function onSubmit(data: SigninInput) {
        const res = await signin(data)

        if (!res.success) {
            toast.error(res.message)
            return
        }

        toast.success(res.message)
        if (res.data.userData.currentOrganization) {
            navigate("/dashboard")
        } else {
            navigate("/create-organization")
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col justify-center items-center w-full'>

            <div className='flex flex-col justify-center items-center gap-1'>
                <h1 className='font-bold text-text text-[20px]'>Welcome back</h1>
                <span className='text-text-md text-[15px]'>Sign in to your InvoiceFlow account</span>
            </div>

            <GoogleButton text="Sign in" />

            <div className="flex flex-col justify-center w-full">

                <AuthInput id="email" placeholder="Email" register={register("email")} type="email" errorMessage={errors.email?.message} label="EMAIL" />


                <div className="flex flex-col gap-1.5">

                    <div className="flex justify-between items-center">
                        <label htmlFor="password" className='text-text-sm font-bold text-[11px]'>PASSWORD</label>

                        <button type="button" onClick={() => navigate("/forgot-password")}
                            className="text-navy-900 font-bold text-[12px] cursor-pointer">Forgot password?</button>
                    </div>

                    <input {...register("password")}
                        className='border-text-sm border rounded-lg py-2 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-sm text-[13px]'
                        placeholder='Password'
                        type="password" id="password" />

                    <p className="min-h-5 text-xs text-red-500">
                        {errors.password?.message}
                    </p>
                </div>
            </div>


            <AuthButton disabled={isSigningIn} loadingText="Signing in..." text="Sign in" />


            <div className="flex gap-1 mt-3 text-[14px]">
                <p className="text-text-sm">Don't have an account?</p>
                <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-navy-900 font-semibold cursor-pointer">Sign up free</button>
            </div>

        </form>
    )
}
