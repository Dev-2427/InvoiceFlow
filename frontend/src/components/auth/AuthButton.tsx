interface IAuthButton {
    disabled: boolean,
    loadingText: string,
    text: string
}

export default function AuthButton({ disabled, loadingText, text }: IAuthButton) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="bg-gold text-gold-dark text-[14px] w-full rounded-lg py-2.5 cursor-pointer font-bold disabled:opacity-60 disabled:cursor-not-allowed">{disabled ? loadingText : text}
        </button>)
}
