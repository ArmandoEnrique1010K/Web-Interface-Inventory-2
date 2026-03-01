import { Link } from "react-router-dom"

type Props = {
    size?: 'small' | 'large'
    text: string
    type: 'submit' | 'button' | 'link'
    to?: string
    color?: 'blue' | 'green' | 'gray' | 'red'
    isLarge?: boolean,
    aditionalStyles?: string,
    disabled?: boolean
}

export const Button = ({ text, type, aditionalStyles, to, size, isLarge, color, disabled }: Props) => {

    const stylesColor = () => {
        if (color === 'blue') {
            return "bg-blue-600 hover:bg-blue-700"
        }

        if (color === 'green') {
            return "bg-green-600 hover:bg-green-700"
        }

        if (color === 'red') {
            return "bg-red-600 hover:bg-red-700"
        }

        if (color === 'gray') {
            return "bg-gray-600 hover:bg-gray-700"
        }
    }

    return (
        <>
            {
                (type === 'submit' || type === 'button') && (
                    <button type={type} className={`
                        text-white
                        cursor-pointer transition-colors
                        font-sans 
                        ${size === 'small' ? 'rounded-md text-md px-3 py-2' : 'font-bold rounded-lg text-lg px-5 py-2'}
                        ${isLarge ? 'w-full' : ''}
                        ${stylesColor()}
                        ${aditionalStyles}
                        ${disabled ? 'opacity-50 hover:cursor-not-allowed' : ''}
                    `}
                        disabled={disabled}
                    >
                        {text}
                    </button>
                )
            }

            {
                type === 'link' && (
                    <Link to={to!} className={`
                        text-white
                        cursor-pointer transition-colors
                        font-sans 
                        ${size === 'small' ? 'rounded-md text-md px-3 py-2' : 'font-bold rounded-lg text-lg px-5 py-2.5'}
                        ${isLarge ? 'w-full' : ''}
                        ${stylesColor()}
                        ${aditionalStyles}`
                    }>
                        {text}
                    </Link>

                )
            }


        </>
    )
}
