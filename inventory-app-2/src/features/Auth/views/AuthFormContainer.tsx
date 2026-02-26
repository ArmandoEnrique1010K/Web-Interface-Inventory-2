import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
    title: string
    onSubmit: React.SubmitEventHandler<HTMLFormElement>,
    helpText?: string,
    children: React.ReactNode,

    secondaryLink?: {
        text: string
        to: string
        linkText: string
    }
}

export const AuthFormContainer = ({ title, onSubmit, helpText, children, secondaryLink }: Props) => {
    return (
        <div className="flex flex-col items-center w-full align-center justify-center sm:p-10 p-6">
            <h1 className="text-4xl font-bold pb-8 w-full text-center">{title}</h1>
            <form onSubmit={onSubmit} className="w-full" autoComplete="off" noValidate>
                {
                    helpText && (
                        <p className='pb-6 w-full'>
                            {helpText}
                        </p>
                    )
                }

                {children}

                {secondaryLink && (
                    <>
                        <hr className="my-8 border-gray-700" />
                        <div className="text-center">
                            <span className="text-gray-700">{secondaryLink.text}</span>
                            <Link to={secondaryLink.to} className="text-green-700">
                                {secondaryLink.linkText}
                            </Link>
                        </div>
                    </>
                )}
            </form>
        </div>
    )
}
