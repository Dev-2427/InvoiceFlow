import type { IconType } from "react-icons"

interface PageHeaderProps {
  title: string,
  subtitle: string,
  buttonText: string,
  icon: IconType
  onClick: () => void
}

export default function PageHeader({ title, buttonText, icon: Icon, subtitle, onClick }: PageHeaderProps) {
  return (
    <div className="px-5 py-4">
      <div className="flex justify-between items-center">

        <span className="text-text text-[22px] font-bold">{title}</span>

        <button
          type="button"
          onClick={onClick}
          className="flex items-center gap-1 bg-gold text-gold-dark px-4 py-2 text-[14px] rounded-lg font-bold cursor-pointer hover:text-gold-dark/80"
        >
          <Icon />
          {buttonText}
        </button>
      </div>

      <span className="text-[14px] text-text-sm">{subtitle}</span>
    </div>
  )
}
