import { Title } from "@/components/Title"

// COMPOSICION DE COMPONENTES
type Props = {
    children: React.ReactNode,
    isCompact?: boolean // prop para compactar el tamaño del formulario
}

export const EntityFormLayout = ({ children, isCompact }: Props) => {
    return (
        <div className={`${isCompact ? '' : 'p-6'}`}>
            {children}
        </div>
    )
}

type HeaderProps = {
    title: string
    helpText?: string
}

EntityFormLayout.Header = ({ title, helpText }: HeaderProps) => {
    return (
        <>
            <Title>{title}</Title>

            {helpText && (
                <p className='pb-6 w-full'>
                    {helpText}
                </p>

            )}
        </>
    )

}


type FormProps = {
    onSubmit: React.SubmitEventHandler<HTMLFormElement>
    children: React.ReactNode
}



EntityFormLayout.Form = ({ onSubmit, children }: FormProps) => {
    return (
        <form onSubmit={
            // (e) => {
            //     e.preventDefault();
            //     onSubmit(e);
            // }
            onSubmit
        } className="p-6 bg-white shadow-sm rounded-xl border border-gray-200 " autoComplete="off" noValidate>
            {children}

        </form >

    )
}

type InputsProps = {
    onSubmit: React.SubmitEventHandler < HTMLFormElement >
        children: React.ReactNode
}
EntityFormLayout.Inputs = ({ children, isCompact }: InputsProps) => {
    return (
        <div className={`${isCompact ? '' : 'space-y-4'}`}>
            {children}
        </div>

    )
}

type ActionsProps = {
    onSubmit: React.SubmitEventHandler < HTMLFormElement >
        children: React.ReactNode
}

EntityFormLayout.Actions = ({ children }: ActionsProps) => {
    return (
        <div className="flex flex-row gap-2 justify-center pt-6">
            {children}
        </div>

    )
}


