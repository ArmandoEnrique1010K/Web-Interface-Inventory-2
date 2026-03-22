import { handleApplyStyleColor } from "@/utils/handleApplyStyleColor"
import { Link } from "react-router-dom"

type Props = {
    size: 'small' | 'large'
    text: string
    to: string
    color: 'blue' | 'green' | 'gray' | 'red' | 'red-outline'
    isLarge?: boolean
    aditionalStyles?: string
    onClick?: () => void
    icon?: React.ReactNode
    showTextOnMobile?: boolean
    showIconOnMobile?: boolean
    isLargeOnMobile?: boolean
}

export const ButtonLink = ({
    text,
    aditionalStyles,
    size,
    isLarge,
    to,
    color,
    onClick,
    icon,
    showTextOnMobile = false,
    showIconOnMobile = true,
    isLargeOnMobile = false,
}: Props) => {

    const baseStyles = `
        inline-flex items-center justify-center ${isLargeOnMobile && 'w-full sm:w-max'}
        font-medium
        select-none
        whitespace-nowrap
        cursor-pointer
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 gap-2
        active:scale-95
    `
    // active añade un estilo cuando el usuario mantiene pulsado el botón

    const sizeStyles =
        size === 'small'
            ? 'text-sm px-3 py-1.5 rounded-md'
            : 'text-lg px-4 py-2 rounded-lg'

    const widthStyles = isLarge ? 'w-full' : ''


    return (
        <Link
            to={to}
            onClick={onClick}
            className={`
                ${baseStyles}
                ${sizeStyles}
                ${widthStyles}
                ${handleApplyStyleColor(color)}
                ${aditionalStyles}
            `}
        >
            {icon && (
                <span
                    className={`
                        flex items-center justify-center size-8
                        ${text ? '' : ''}
                        ${showIconOnMobile ? '' : 'hidden sm:inline'}
                    `}
                >
                    {icon}
                </span>
            )}

            {/* TEXTO */}
            {text && (
                <span className={showTextOnMobile ? '' : 'hidden sm:inline'}>
                    {text}
                </span>
            )}
        </Link>
    )
}
