import { Button } from '@/ui/Button'
import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
    title: string
    onSubmit: React.SubmitEventHandler<HTMLFormElement>,
    isPending?: boolean,
    helpText?: string,
    inputsFields: React.ReactNode,
    buttonText?: string,
    secondaryLink?: {
        text: string
        to: string
        linkText: string
    }
}

export const AuthFormContainer = ({ title, onSubmit, isPending, helpText, inputsFields, secondaryLink, buttonText = 'Enviar' }: Props) => {
    return (
        <div className="flex flex-col w-full">
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-4">{title}</h1>
            {
                helpText && (
                    <p className='text-sm text-slate-600 mb-4 text-center'>
                        {helpText}
                    </p>
                )
            }

            <form onSubmit={onSubmit} className="w-full space-y-4 mt-2" autoComplete="off" noValidate>
                {inputsFields}

                <Button
                    size="large"
                    text={isPending ? 'Espere...' : buttonText}
                    type="submit"
                    color='green'
                    isLarge={true}
                    aditionalStyles="mt-2"
                    disabled={isPending}
                />
            </form>

            {secondaryLink && (
                <>
                    <hr className="my-6 border-slate-200" />
                    <div className="text-center text-sm text-slate-600">
                        {secondaryLink.text}
                        <Link to={secondaryLink.to} className="text-blue-600 hover:underline ml-1">
                            {secondaryLink.linkText}
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}
