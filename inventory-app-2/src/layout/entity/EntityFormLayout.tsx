import { Title } from "@/components/Title"

// COMPOSICION DE COMPONENTES
type Props = {
    children: React.ReactNode,
    isCompact?: boolean // prop para compactar el tamaño del formulario
}

export const EntityFormLayout = ({ children, isCompact }: Props) => {
    return (
        <div className={` ${isCompact ? '' : 'p-4 sm:p-6'}`}>
            {children}
        </div>
    )
}

type HeaderProps = {
    title?: string
    helpText?: string
    isCompact?: boolean
}

EntityFormLayout.Header = ({ title, helpText, isCompact }: HeaderProps) => {
    return (
        <>
            {title && <Title>{title}</Title>}

            {helpText && (
                <p className={`${isCompact ? 'pb-4' : 'pb-6'} w-full text-sm text-slate-700`}>
                    {helpText}
                </p>

            )}
        </>
    )

}


type FormProps = {
    onSubmit: React.SubmitEventHandler<HTMLFormElement>
    children: React.ReactNode
    styled?: boolean
}



EntityFormLayout.Form = ({ onSubmit, children, styled }: FormProps) => {
    return (
        <form onSubmit={
            // (e) => {
            //     e.preventDefault();
            //     onSubmit(e);
            // }
            onSubmit
        } className={`${styled ? 'p-6 bg-white shadow-sm rounded-xl border border-gray-200' : 'pt-2'} `} autoComplete="off" noValidate >
            {children}

        </form >

    )
}

type InputsProps = {
    children: React.ReactNode
    isCompact?: boolean,
}

EntityFormLayout.Inputs = ({ children, isCompact }: InputsProps) => {
    return (
        <>
            <div className={`${isCompact ? 'space-y-2' : 'space-y-4'}`}>
                {children}
            </div>
        </>
    )
}

type ActionsProps = {
    children: React.ReactNode
    isCompact?: boolean
}

EntityFormLayout.Actions = ({ children, isCompact }: ActionsProps) => {
    return (
        <div className={`flex flex-row gap-6 justify-center  ${isCompact ? 'pt-4' : 'sm:pt-6 pt-4'} min-w-full`}>
            {children}
        </div>

    )
}


