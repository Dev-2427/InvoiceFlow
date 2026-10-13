import { FcGoogle } from "react-icons/fc";
import authStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function GoogleButton({ text }: { text: string }) {

    const googleAuth = authStore((state) => state.googleAuth)

    const navigate = useNavigate()

    const login = useGoogleLogin({
        flow: "auth-code",

        onSuccess: async ({ code }) => {
            console.log("code", code)
            const res = await googleAuth(code)
            if (res.success) {
                toast.success(res.message)

                if (res.data.userData.currentOrganization) {
                    navigate("/dashboard")
                } else {
                    navigate("/create-organization")
                }
            } else {
                toast.error(res.message)
            }
        },

        onError: () => {
            console.error("Google login failed")
            toast.error("Google authentication failed")
        }

    })

    return (
        <>
            <div onClick={() => login()} className='flex justify-center items-center gap-3 my-5 border-border border-[1.5px] w-full rounded-xl py-2 cursor-pointer select-none'>
                <FcGoogle size={20} />
                <span className='text-text font-semibold text-[14px]'>{text} with Google</span>
            </div>


            <div className="flex justify-between items-center gap-1 w-full mb-5">
                <hr className='border-text-sm opacity-40 w-full' />
                <span className='text-text-sm text-xs tracking-wider font-semibold'>OR</span>
                <hr className='border-text-sm w-full opacity-40' />
            </div>
        </>
    )
}
