type Props = {
    title: string;
    buttons?: React.ReactNode
    children: React.ReactNode;
}

// Componente generico para mostrar datos en una lista
export const ListDataContainer = ({ title, buttons, children }: Props) => {
    return (
        <>
            <h1 className='text-4xl font-bold pb-6'>{title}</h1>
            {
                buttons && (
                    <div className='flex flex-row pb-6'>
                        {buttons}
                    </div>
                )
            }

            {children}
        </>
    )
}
