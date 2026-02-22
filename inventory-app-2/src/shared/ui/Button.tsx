type Props = {
    text: string
    type: 'submit' | 'button'
    color: string
    hoverColor: string
}

export const Button = ({ text, type, color, hoverColor }: Props) => {
    return (
        <div className="flex items-center justify-center pt-4">
            <button type={type} className={`w-full text-white
                px-5 py-2 border border-gray-300 rounded ${color} 
                cursor-pointer transition-colors ${hoverColor}
                font-sans font-bold text-lg`
            }
            >
                {text}
            </button>
        </div>
    )
}
