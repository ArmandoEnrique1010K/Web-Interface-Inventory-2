import { Button } from "@/ui/Button"
import type React from "react"
import { Link } from "react-router-dom"

type Props = {
    children: React.ReactNode
}

export const AuthFormLayout = ({ children }: Props) => {
    return (
        <div className="flex flex-col w-full">
            {children}
        </div>
    )
}

type HeaderProps = {
    title: string,
    helpText?: string
}

AuthFormLayout.Header = ({ title, helpText }: HeaderProps) => {
    return (
        <>
            <h1 className="text-2xl font-bold text-slate-900 text-center mb-4">{title}</h1>

            {helpText && (
                <p className='text-sm text-slate-600 mb-4 text-center'>
                    {helpText}
                </p>
            )
            }

        </>
    )
}

type FormProps = {
    isPending: boolean,
    buttonText?: string,
    children: React.ReactNode
    onSubmit: React.SubmitEventHandler<HTMLFormElement>,
}

AuthFormLayout.Form = ({ isPending, buttonText, children, onSubmit }: FormProps) => {
    return (
        <form onSubmit={onSubmit} className="w-full space-y-4 mt-2" autoComplete="off" noValidate>
            {children}

            <Button
                size="large"
                text={isPending ? 'Espere...' : buttonText ?? 'Enviar'}
                type="submit"
                color='green'
                isLarge={true}
                aditionalStyles="mt-2"
                disabled={isPending}
            />
        </form>

    )
}

type LinkProps = {
    text: string,
    to: string,
    linkText: string,
}

AuthFormLayout.Link = ({ text, to, linkText }: LinkProps) => {
    return (
        <>
            <hr className="my-6 border-slate-200" />
            <div className="text-center text-sm text-slate-600">
                {text},
                <Link to={to} className="text-blue-600 hover:underline ml-1">
                    {linkText}
                </Link>
            </div>
        </>

    )
}