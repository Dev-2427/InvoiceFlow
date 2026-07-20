import { Link } from "react-router-dom";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { IoHomeOutline } from "react-icons/io5";

export default function NotFound() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page px-6">

            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-navy-700/5 blur-3xl" />

            <h1 className="pointer-events-none absolute select-none text-[180px] font-black leading-none text-navy-200/25 md:text-[260px]">
                404
            </h1>

            <div className="relative z-10 flex max-w-lg flex-col items-center text-center">

                <div className="relative mb-8">

                    <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-overdue-border bg-overdue-bg text-sm font-bold text-overdue shadow">
                        !
                    </div>

                    <div className="flex h-28 w-24 flex-col items-center justify-center rounded-2xl border border-border bg-card shadow-lg">

                        <HiOutlineDocumentText className="mb-2 text-5xl text-gold" />

                        <div className="h-1 w-10 rounded-full bg-border" />
                        <div className="mt-2 h-1 w-7 rounded-full bg-border" />

                    </div>

                </div>

                <span className="rounded-full border border-gold bg-gold-light px-4 py-1 text-xs font-bold tracking-wider text-gold-dark uppercase">
                    404 • Page Not Found
                </span>

                <h2 className="mt-6 text-4xl font-bold tracking-tight text-text">
                    Oops!
                </h2>

                <p className="mt-3 text-lg font-semibold text-text-md">
                    We couldn't find the page you're looking for.
                </p>

                <p className="mt-2 max-w-md text-sm leading-7 text-text-sm">
                    The page may have been moved, deleted, or the URL might be
                    incorrect. Let's get you back to InvoiceFlow.
                </p>


                <Link
                    to="/" replace
                    className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-semibold text-gold-dark shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:opacity-93 hover:shadow-xl active:translate-y-0"
                >
                    <IoHomeOutline className="text-lg" />
                    Go Home
                </Link>

                <p className="mt-8 text-xs text-text-xs">
                    InvoiceFlow • Invoice Manager
                </p>

            </div>

        </main>
    );
}