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
            className="bg-gold text-gold-dark text-[14px] w-full rounded-xl py-3 cursor-pointer font-bold disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:opacity-93">{disabled ? loadingText : text}
        </button>)
}
