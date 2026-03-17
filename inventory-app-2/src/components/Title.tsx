
type Props = {
    children: string
}
export const Title = ({ children }: Props) => {
    return (
        <h1 className='text-4xl font-bold mb-6'>{children}</h1>
    )
}
