import { Title } from "@/components/Title"
import { useMediaQuery } from "react-responsive"

// COMPOSICION DE COMPONENTES
type Props = {
    children: React.ReactNode
}

export const FormModalLayout = ({ children }: Props) => {

    const isSmallScreen = useMediaQuery({ query: '(max-width: 480px)' })

    return (
        <div className={`${!isSmallScreen ? '' : ''}`}>
            {children}
        </div>
    )
}

type HeaderProps = {
    title?: string
    helpText?: string
}

FormModalLayout.Header = ({ title, helpText }: HeaderProps) => {
    return (
        <>
            {title && <Title>{title}</Title>}

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



FormModalLayout.Form = ({ onSubmit, children }: FormProps) => {

    return (
        <form onSubmit={
            // (e) => {
            //     e.preventDefault();
            //     onSubmit(e);
            // }
            onSubmit
        } className={`xs:p-4 p-2 bg-white shadow-sm rounded-xl border border-gray-200 `} autoComplete="off" noValidate>
            {children}

        </form >

    )
}


FormModalLayout.Inputs = ({ children }: Props) => {
    return (
        <div className='space-y-4'>
            {children}
        </div>

    )
}

FormModalLayout.Actions = ({ children }: Props) => {
    return (
        <div className="flex flex-row gap-2 justify-center pt-6">
            {children}
        </div>

    )
}