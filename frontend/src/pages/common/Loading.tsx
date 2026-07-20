import { HiOutlineDocumentText } from "react-icons/hi2";

export default function Loading() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy-900 px-6">

            <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-gold/5 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />

            <div className="absolute left-[12%] top-[28%] h-2 w-2 animate-pulse rounded-full bg-gold/40" />
            <div className="absolute right-[16%] top-[22%] h-1.5 w-1.5 animate-pulse rounded-full bg-white/20 delay-300" />
            <div className="absolute right-[10%] bottom-[26%] h-2 w-2 animate-pulse rounded-full bg-gold/30 delay-700" />

            <div className="flex flex-col items-center">

                <div className="relative mb-8">

                    <span className="absolute inset-0 scale-125 animate-ping rounded-full border border-gold/20" />
                    <span className="absolute inset-0 scale-150 animate-ping rounded-full border border-gold/10 [animation-delay:400ms]" />

                    {/* Logo Box */}
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gold shadow-[0_0_35px_rgba(228,180,41,0.35)]">
                        <HiOutlineDocumentText className="text-4xl text-gold-dark" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-white">
                    InvoiceFlow
                </h1>

                <p className="mt-1 text-sm font-medium text-text-xs">
                    Invoice Manager
                </p>

                <div className="mt-12 flex items-center gap-1 text-sm font-medium text-text-xs">
                    <span>Checking your session</span>

                    <span className="animate-bounce [animation-delay:0ms]">
                        .
                    </span>

                    <span className="animate-bounce [animation-delay:150ms]">
                        .
                    </span>

                    <span className="animate-bounce [animation-delay:300ms]">
                        .
                    </span>
                </div>

                <div className="mt-8 h-12 w-12 rounded-full border-[3px] border-navy-700 border-t-gold animate-spin" />

            </div>

        </main>
    );
}