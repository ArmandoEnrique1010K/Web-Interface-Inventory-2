import { handleApplyStyleColor } from "@/utils/handleApplyStyleColor"
import { Link } from "react-router-dom"

type Props = {
    size: 'small' | 'large'
    text: string,
    to: string,
    color: 'blue' | 'green' | 'gray' | 'red',
    isLarge?: boolean,
    aditionalStyles?: string,
    onClick?: () => void
}

export const ButtonLink = ({ size, text, to, color, isLarge, aditionalStyles, onClick }: Props) => {
    return (
        <Link to={to!} className={`
                        text-white
                        cursor-pointer transition-colors
                        font-sans 
                        ${size === 'small' ? 'rounded-md text-md px-3 py-2' : 'font-bold rounded-lg text-lg px-5 py-2.5'}
                        ${isLarge ? 'w-full' : ''}
                        ${handleApplyStyleColor(color)}
                        ${aditionalStyles}`}
            onClick={onClick || undefined}
        >
            {text}
        </Link >
    )
}
