import { handleApplyStyleColor } from "@/utils/handleApplyStyleColor"
import { useMediaQuery } from "react-responsive"
import { Link } from "react-router-dom"

type Props = {
    size: 'small' | 'large'
    text: string
    to: string
    color: 'blue' | 'green' | 'gray' | 'red'
    isLarge?: boolean
    aditionalStyles?: string
    onClick?: () => void
    icon?: React.ReactNode
}

export const ButtonLink = ({
    text,
    aditionalStyles,
    size,
    to,
    color,
    isLarge,
    onClick,
    icon
}: Props) => {
    // TODO: CORREGIR EL ANCHO DE PANTALLA
    const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' })

    const baseStyles = `
        inline-flex items-center justify-center 
        font-medium
        select-none
        whitespace-nowrap
        cursor-pointer
        transition-all duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
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
                <span className={`flex items-center justify-center size-8 ${isSmallScreen ? '' : 'mr-2'}`}>
                    {icon}
                </span>
            )}
            <span>{isSmallScreen && icon || text}</span>
        </Link>
    )
}
