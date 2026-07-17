import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signinSchema, type SigninInput } from "../../validation/authValidation";
import authStore from "../../store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

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

            <div className='flex justify-center items-center gap-2 my-5 border-text-sm border w-full rounded-2xl py-2 cursor-pointer'>
                <FcGoogle size={20} />
                <span className='text-text font-semibold text-[14px]'>Sign in with Google</span>
            </div>


            <div className="flex justify-between items-center gap-1 w-full mb-5">
                <hr className='border-text-sm  w-full' />
                <span className='text-text-sm text-sm font-semibold'>OR</span>
                <hr className='border-text-sm w-full' />
            </div>

            <div className="flex flex-col justify-center w-full">

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


            <button
                type="submit"
                disabled={isSigningIn}
                className="bg-gold text-gold-dark text-[14px] mt-5 w-full rounded-lg py-2.5 cursor-pointer font-bold disabled:opacity-60 disabled:cursor-not-allowed">{isSigningIn ? "Signing in..." : "Sign in"}
            </button>


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
