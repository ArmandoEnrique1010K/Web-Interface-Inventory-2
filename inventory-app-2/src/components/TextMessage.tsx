type Props = {
    text: string,
    align: 'left' | 'right' | 'center',
    color: 'red' | 'black'
}
export const TextMessage = ({ text, align, color }: Props) => {

    const handleAlign = () => {
        switch (align) {
            case 'left':
                return 'justify-start'
            case 'right':
                return 'justify-end'
            case 'center':
                return 'justify-center'
        }
    }

    const handleColor = () => {
        switch (color) {
            case 'red':
                return 'text-red-600'
            case 'black':
                return 'text-black'
        }
    }

    return (
        <div className={`flex py-4 ${handleAlign()} text-xl ${handleColor()}`}>{text}</div>)
}
