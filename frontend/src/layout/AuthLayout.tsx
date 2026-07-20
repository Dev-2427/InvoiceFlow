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
        <main className='min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-navy-900 sm:px-6 lg:px-8'>

            <div className="flex flex-col justify-center items-center gap-8 bg-page max-w-md w-full rounded-2xl py-8 px-6 sm:px-8 sm:py-10 shadow-2xl">

                <div className='flex flex-col justify-center items-center gap-2'>

                    <div className='bg-gold w-14 h-14 rounded-lg flex justify-center items-center'>
                        < HiOutlineDocumentText className='text-2xl text-gold-dark' />
                    </div>

                    <h1 className='font-bold text-3xl tracking-tight text-text'>InvoiceFlow</h1>

                    <p className='text-text-md font-semibold text-sm'>Invoice Manager</p>

                </div>

                <Outlet />
            </div>
        </main>
    )
}