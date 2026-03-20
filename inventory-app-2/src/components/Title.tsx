import { useMediaQuery } from "react-responsive"

type Props = {
    children: string
}
export const Title = ({ children }: Props) => {

    const isSmallScreen = useMediaQuery({ query: '(max-width: 640px)' })

    return (
        <h1 className={`${isSmallScreen ? 'text-4xl' : 'text-4xl'} font-bold mb-6`}>{children}</h1>
    )
}
