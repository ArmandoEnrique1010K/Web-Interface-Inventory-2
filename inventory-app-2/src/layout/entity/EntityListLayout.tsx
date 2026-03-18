import { Title } from "@/components/Title"

// COMPOSICION DE COMPONENTES
type Props = {
    children: React.ReactNode
}

export const EntityListLayout = ({ children }: Props) => {
    return (
        <div className='p-6'>
            {children}
        </div>
    )
}

type HeaderProps = {
    title: string
    actions?: React.ReactNode
}


EntityListLayout.Header = ({ title, actions }: HeaderProps) => {
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


EntityListLayout.Content = ({ children }: Props) => {
    return (
        <div className="space-y-6">
            {children}
        </div>
    )
}

