import { FcGoogle } from "react-icons/fc";

export default function GoogleButton({ text }: { text: string }) {
    return (
        <>
            <div className='flex justify-center items-center gap-2 my-5 border-text-sm border w-full rounded-2xl py-2 cursor-pointer'>
                <FcGoogle size={20} />
                <span className='text-text font-semibold text-[14px]'>{text} with Google</span>
            </div>


            <div className="flex justify-between items-center gap-1 w-full mb-5">
                <hr className='border-text-sm  w-full' />
                <span className='text-text-sm text-sm font-semibold'>OR</span>
                <hr className='border-text-sm w-full' />
            </div>
        </>
    )
}
