import { handleApplyStyleColor } from "@/utils/handleApplyStyleColor"
import { useMediaQuery } from "react-responsive"

type Props = {
    size?: 'small' | 'large' // Tamaño
    text: string // Texto
    type: 'submit' | 'button' // Tipo
    color: 'blue' | 'green' | 'gray' | 'red' | 'none' | 'green-outline' | 'red-outline' // Color
    isLarge?: boolean, // ¿Ocupa todo el ancho?
    aditionalStyles?: string, // Estilos adicionales
    disabled?: boolean // Deshabilitado
    onClick?: () => void // Función al hacer clic
    icon?: React.ReactNode // Icono
}

export const Button = ({
    text,
    type,
    aditionalStyles,
    size,
    isLarge,
    color,
    disabled,
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
        
        ${!disabled ? 'active:scale-95' : ''}
    `
    // active añade un estilo cuando el usuario mantiene pulsado el botón

    const sizeStyles =
        size === 'small'
            ? 'text-sm px-3 py-1.5 rounded-md'
            : 'text-lg px-4 py-2 rounded-lg'

    const widthStyles = isLarge ? 'w-full' : ''


    return (
        <button
            type={type}
            className={`
                ${baseStyles}
                ${sizeStyles}
                ${widthStyles}
                ${handleApplyStyleColor(color)}
                ${disabled ? 'opacity-50 hover:cursor-not-allowed' : ''}
                ${color === 'none' && 'hover:cursor-auto!'}
                ${aditionalStyles}
            `}
            disabled={disabled}
            onClick={onClick}
        >
            {icon && (
                <span className={`flex items-center justify-center size-8 ${isSmallScreen ? '' : 'mr-2'}`}>
                    {icon}
                </span>
            )}
            <span>{isSmallScreen && icon || text}</span>
        </button>
    )
}
