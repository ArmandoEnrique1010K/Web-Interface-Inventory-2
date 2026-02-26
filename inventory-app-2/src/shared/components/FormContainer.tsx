import React from 'react'
type Props = {
    onSubmit: React.SubmitEventHandler<HTMLFormElement>,
    helpText?: string,
    children: React.ReactNode,
    buttons: React.ReactNode,
}

// Componente generico para mostrar un formulario
export const FormContainer = ({ onSubmit, helpText, children, buttons }: Props) => {
    return (
        <form onSubmit={onSubmit} className="w-full" autoComplete="off" noValidate>
            {
                helpText && (
                    <p className='pb-6 w-full'>
                        {helpText}
                    </p>
                )
            }

            {children}

            <div className="flex flex-row gap-2 justify-center pt-6">
                {buttons}
            </div>

        </form>
    )
}
