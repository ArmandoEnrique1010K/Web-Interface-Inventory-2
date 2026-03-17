import React from 'react'
import { Title } from './Title'
type Props = {
    title: string
    onSubmit: React.SubmitEventHandler<HTMLFormElement>,
    helpText?: string,
    inputsFields: React.ReactNode,
    buttons: React.ReactNode,
}

// Componente generico para mostrar un formulario
export const BaseForm = ({ title, onSubmit, helpText, inputsFields, buttons }: Props) => {
    return (
        <div className='p-6'>
            <Title>{title}</Title>

            <form onSubmit={
                // (e) => {
                //     e.preventDefault();
                //     onSubmit(e);
                // }
                onSubmit
            } className="p-6 bg-white shadow-sm rounded-xl border border-gray-200 " autoComplete="off" noValidate>
                {
                    helpText && (
                        <p className='pb-6 w-full'>
                            {helpText}
                        </p>
                    )
                }

                <div className='space-y-4'>
                    {inputsFields}
                </div>

                <div className="flex flex-row gap-2 justify-center pt-6">
                    {buttons}
                </div>
            </form>
        </div>
    )
}
