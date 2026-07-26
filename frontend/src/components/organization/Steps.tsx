import { HiCheck } from "react-icons/hi2";

interface ISteps {
    step: number,
    info: string,
    status: "current" | "complete" | "pending"
}

export default function Steps({ step, info, status }: ISteps) {
    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col items-center justify-center gap-1">
                <div className={`${status === "complete" ? "bg-paid" : status === "current" ? "bg-gold" : "bg-border"} w-8 h-8 rounded-full flex justify-center items-center`}>
                    {status === "complete" ?
                        < HiCheck className='text-xl text-card' />
                        :
                        <span className={`text-xl ${status === "current" ? "text-gold-dark" : "text-text-xs"} font-semibold`}>{step}</span>
                    }
                </div>

                <p className={`text-xs font-bold truncate ${status === "complete" ? "text-paid" : status === "current" ? "text-navy-700" : "text-text-xs"} `}>{info}</p>
            </div>
        </div >
    )
}
