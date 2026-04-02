type Props = {
    children: string
}
export const Title = ({ children }: Props) => {
    return (
        <h1 className='text-4xl font-bold sm:mb-6 mb-4'>{children}</h1>
    )
}
