import { HiLockClosed, HiCheck } from "react-icons/hi2";
import { currencies } from "../../../utils/currencies";
import { useFormContext } from "react-hook-form";
import type { CreateOrganizationInput } from "../../../validation/organizationValidation";

export default function CurrencyForm() {

  const { setValue, watch, register, formState: { errors } } = useFormContext<CreateOrganizationInput>()

  const code = watch("currencyCode")
  const termsAndConditions = watch("termsAndConditions")

  return (
    <div className="flex flex-col items-center gap-5">

      <div className="flex items-center self-start gap-2">
        <div className="flex justify-center items-center w-7 h-7 bg-navy-50 text-navy-700 font-semibold rounded-full">
          3
        </div>
        <p className="font-semibold text-navy-700">Select Currency</p>
      </div>

      {/* warning box */}
      <div className="flex items-start gap-2 border-unpaid-border border-[1.5px] rounded-xl bg-unpaid-bg text-unpaid p-5">
        <HiLockClosed size={30} />

        <div className="flex flex-col">
          <p className="font-bold text-[12px]">Choose carefully — this cannot be changed</p>
          <p className="text-[12px]">Your organisation currency is permanent. All invoices, reports and amounts will use this currency. Create a new organisation if you need a different currency.</p>
        </div>
      </div>


      {/* select currency section */}
      <p className="text-text-sm self-start font-bold text-xs">ORGANIZATION CURRENCY</p>

      <div className="grid sm:grid-cols-2 grid-cols-1 justify-between items-center gap-3 h-64 overflow-y-scroll  sm-w-auto w-full">

        {currencies.map((currency) => (
          <button
            type="button"
            className={`${code === currency.code ? "bg-navy-50  border-navy-700" : "border-border"} border-[1.5px] rounded-xl cursor-pointer p-5 transition-colors duration-200`}
            onClick={() => setValue("currencyCode", currency.code, {
              shouldValidate: true,
            })}
            key={currency.name}>
            <div className="flex items-center gap-3">

              <div className={`flex justify-center items-center font-bold ${code === currency.code ? "bg-gold text-gold-dark" : "bg-page text-text-sm"} w-8 h-8 rounded-lg `}>
                <span>{currency.symbol}</span>
              </div>

              <div className="flex flex-col items-start">
                <p className={` font-bold text-sm ${code === currency.code ? "text-text" : "text-navy-700"}`}>{currency.code}</p>
                <p className="text-text-xs text-sm">{currency.name}</p>
              </div>

            </div>
          </button>
        ))}
      </div>

      <p className="text-overdue text-xs mt-3 self-start font-semibold">
        {errors.currencyCode?.message}
      </p>


      {/* selected currency code  */}
      {code &&
        <div className="flex items-center gap-2 mt-5 bg-paid-bg border-paid-border text-paid border p-3 rounded-lg w-full">
          <HiCheck />
          <p className="text-sm">Selected: <span className="font-bold">{code}</span> — all invoice amounts will be shown in {code}</p>
        </div>
      }


      {/* terms and conditions  */}
      <div className="flex flex-col self-start items-start gap-2 w-full">
        <div className="flex items-center gap-2">
          <p className="text-text-sm font-bold text-xs">INVOICE TERMS & CONDITIONS</p>

          <div className="flex justify-center items-center rounded-xl border border-border bg-page text-text-xs text-[8px] py-1 px-2 font-semibold">
            Optional
          </div>
        </div>

        <textarea
          {...register("termsAndConditions")}
          className="border-[1.5px] border-text-xs/30 rounded-lg w-full text-[14px] p-2 text-text-xs outline-none focus:ring-[1.5px] placeholder:text-text-xs transition-all duration-200"
          placeholder="e.g. Payment is due within 15 days of invoice date."
          maxLength={500}
        />

        <p className="text-text-xs self-end text-xs">{termsAndConditions.length}/500 characters</p>

        <p className="text-text-xs text-xs">This text will appear at the bottom of every invoice you send</p>
      </div>

    </div>

  )
}
