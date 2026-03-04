import { handleApplyStyleColor } from "@/utils/handleApplyStyleColor"

type Props = {
    size?: 'small' | 'large'
    text: string
    type: 'submit' | 'button'
    color: 'blue' | 'green' | 'gray' | 'red'
    isLarge?: boolean,
    aditionalStyles?: string,
    disabled?: boolean
    onClick?: () => void
}

export const Button = ({ text, type, aditionalStyles, size, isLarge, color, disabled, onClick }: Props) => {

    return (
        <>
            {
                <button type={type} className={`
                        text-white
                        cursor-pointer transition-colors
                        font-sans 
                        ${size === 'small' ? 'rounded-md text-md px-3 py-2' : 'font-bold rounded-lg text-lg px-5 py-2'}
                        ${isLarge ? 'w-full' : ''}
                        ${handleApplyStyleColor(color)}
                        ${aditionalStyles}
                        ${disabled ? 'opacity-50 hover:cursor-not-allowed' : ''}`}
                    disabled={disabled}
                    onClick={onClick || undefined}
                >
                    {text}
                </button>
            }
        </>
    )
}
