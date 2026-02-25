import { Link } from "react-router-dom"

type Props = {
    text: string
    type: 'submit' | 'button' | 'link'
    aditionalStyles: string
    to?: string
}

export const Button = ({ text, type, aditionalStyles, to }: Props) => {
    return (
        <>
            {
                (type === 'submit' || type === 'button') && (
                    <button type={type} className={`text-white
                px-5 py-2 border border-gray-300 rounded 
                cursor-pointer transition-colors
                font-sans font-bold text-lg  ${aditionalStyles}`
                    }>
                        {text}
                    </button>
                )
            }

            {
                type === 'link' && (
                    <Link to={to!} className={`text-white
                px-5 py-2 border border-gray-300
                cursor-pointer transition-colors
                font-sans font-bold text-md text-center  ${aditionalStyles}`
                    }>
                        {text}
                    </Link>

                )
            }


        </>
    )
}
