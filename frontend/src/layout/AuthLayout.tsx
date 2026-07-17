import { Outlet } from "react-router-dom";
import { useEffect } from "react"
import { HiOutlineDocumentText } from "react-icons/hi2";

export default function AuthLayout() {

    useEffect(() => {
        document.body.style.backgroundColor = "#0D1F33"

        return () => {
            document.body.style.backgroundColor = ""
        }
    }, [])

    return (
        <main className='min-h-screen flex flex-col justify-center items-center px-4 py-15 bg-navy-900'>

            <div className="flex flex-col justify-center items-center gap-8 bg-card max-w-md w-full rounded-xl py-8 px-10 shadow-2xl">

                <div className='flex flex-col justify-center items-center gap-2'>

                    <div className='bg-gold w-12 h-12 rounded-lg flex justify-center items-center'>
                        < HiOutlineDocumentText className='text-2xl text-gold-dark' />
                    </div>

                    <h1 className='font-bold text-2xl text-text'>InvoiceFlow</h1>

                    <p className='text-text-md font-semibold text-[13px]'>Invoice Manager</p>

                </div>

                <Outlet />
            </div>
        </main>
    )
}