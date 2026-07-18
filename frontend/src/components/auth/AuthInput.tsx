import type { UseFormRegisterReturn } from "react-hook-form"

interface IAuthInput {
    id: string,
    optional?: boolean,
    label?: string,
    type: string,
    placeholder: string,
    register: UseFormRegisterReturn,
    errorMessage?: string
}

export default function AuthInput({ id, optional = false, label, type, placeholder, register, errorMessage }: IAuthInput) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex gap-1">
                {label &&
                    <label htmlFor={id} className='text-text-sm font-bold text-[11px]'>{label}</label>
                }
                {optional &&
                    <span className="text-text-sm font-semibold text-[11px]">(Optional)</span>
                }
            </div>
            <input {...register}
                className='border-text-sm border rounded-lg py-2 px-3 text-text-sm outline-none focus:ring-[1.5px] placeholder:text-text-sm text-[13px] w-full'
                placeholder={placeholder}
                type={type} id={id} />

            <p className="min-h-5 text-xs text-red-500">
                {errorMessage}
            </p>
        </div>)
}
