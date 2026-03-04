type Props = {
    title: string;
    buttons?: React.ReactNode
    searchParams?: React.ReactNode
    children: React.ReactNode;
}

// Componente generico para mostrar datos en una lista
export const TitleContainer = ({ title, buttons, searchParams, children }: Props) => {
    return (
        <>
            <h1 className='text-4xl font-bold mb-6'>{title}</h1>
            {
                buttons && (
                    <div className='flex flex-row mb-6 gap-4'>
                        {buttons}
                    </div>
                )
            }
            {searchParams}
            {children}
        </>
    )
}
