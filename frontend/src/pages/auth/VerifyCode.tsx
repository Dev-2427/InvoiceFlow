import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifyCodeSchema, type VerifyCodeInput } from "../../validation/authValidation";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../store/authStore"
import toast from "react-hot-toast";
import { useEffect } from "react"
import { HiOutlineEnvelope, HiArrowLeft } from "react-icons/hi2";
import AuthInput from "../../components/auth/AuthInput";
import AuthButton from "../../components/auth/AuthButton";

export default function VerifyCode() {

    const { userId } = useParams()
    const { state } = useLocation()
    const email = state?.email

    const navigate = useNavigate()

    useEffect(() => {
        if (!userId || !email) {
            navigate(-1)
        }
    }, [userId, email, navigate])


    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(verifyCodeSchema),
        defaultValues: { userId }
    })

    const verifyCode = useAuth((state) => state.verifyCode)
    const isVerifyingCode = useAuth((state) => state.isVerifyingCode)

    async function onSubmit(data: VerifyCodeInput) {
        const res = await verifyCode(data)

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

            <div className='flex flex-col justify-center items-center gap-2 mb-4'>

                <div className="flex justify-center items-center border-gold border-2 rounded-lg w-14 h-14 bg-gold-light">
                    <HiOutlineEnvelope className="text-3xl text-gold" />
                </div>

                <h1 className='font-bold text-text text-[20px]'>Check your email</h1>
                <span className='text-text-md text-[13px]'>We sent a 6-digit verification code to</span>

                <span className='text-navy-900 text-[13px] font-bold'>{email}</span>

            </div>


            <div className="w-full">
                <AuthInput id="code" placeholder="Code" register={register("verificationCode")} type="text" errorMessage={errors.verificationCode?.message} />
            </div>


            <AuthButton disabled={isVerifyingCode} loadingText="Verifying..." text="Verify Email" />


            <hr className='border-text-sm border-1.0 w-full my-5 opacity-50' />

            <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex cursor-pointer items-center gap-1">

                <HiArrowLeft className="text-text-sm" />
                <p className="text-text-sm text-[14px] font-semibold">Cancel and go back</p>
            </button>

        </form>
    )
}
