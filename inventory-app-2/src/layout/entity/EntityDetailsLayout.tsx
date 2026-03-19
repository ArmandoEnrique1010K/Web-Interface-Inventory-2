import { Title } from "@/components/Title"

// COMPOSICION DE COMPONENTES
type Props = {
    children: React.ReactNode
}

export const EntityDetailsLayout = ({ children }: Props) => {
    return (
        <div className='p-6 w-full'>
            {children}
        </div>
    )
}

type HeaderProps = {
    title: string
    actions?: React.ReactNode
}


EntityDetailsLayout.Header = ({ title, actions }: HeaderProps) => {
    return (
        <>
            <Title>{title}</Title>

            {actions && (
                <div className='flex flex-row mb-6 gap-4'>
                    {actions}
                </div>
            )}
        </>
    )
}

EntityDetailsLayout.Content = ({ children }: Props) => {
    return (
        <div className="flex flex-col justify-center items-center">
            <div className=" mx-auto grid grid-cols-1 lg:grid-cols-8 gap-6 w-full">
                {children}
            </div>
        </div>
    )
}

EntityDetailsLayout.Left = ({ children }: Props) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 lg:col-span-5">
            {children}
        </div>
    )
}

EntityDetailsLayout.Right = ({ children }: Props) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 lg:col-span-3">
            {children}
        </div>
    )
}

EntityDetailsLayout.Summary = ({ children }: Props) => {
    return (
        <div className="w-full mx-auto">
            {children}
        </div>
    )
}