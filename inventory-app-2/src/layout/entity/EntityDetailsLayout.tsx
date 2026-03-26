import { Title } from "@/components/Title"
import type React from "react"

// COMPOSICION DE COMPONENTES
type Props = {
    children: React.ReactNode
}

export const EntityDetailsLayout = ({ children }: Props) => {
    return (
        <div className='sm:p-6 p-4 w-full'>
            {children}
        </div>
    )
}

type HeaderProps = {
    title: string
    textDetails?: React.ReactNode
    actions?: React.ReactNode
}


EntityDetailsLayout.Header = ({ title, textDetails, actions }: HeaderProps) => {
    return (
        <>
            <div className="flex flex-1 flex-col sm:flex-row justify-between sm:gap-4 gap-0">
                {
                    textDetails ? (
                        <>
                            <div className="flex-5">
                                <Title>{title}</Title>
                            </div>
                            <div className="flex-4 pb-6 sm:pb-0">
                                {textDetails && (
                                    <div className="text-xs">{textDetails}</div>
                                )}
                            </div>
                        </>

                    ) : (
                        <>
                            <Title>{title}</Title>
                        </>
                    )
                }
            </div>


            {actions && (
                <div className='flex flex-row mb-6 gap-4'>
                    {actions}
                </div>
            )}
        </>
    )
}

type ContentProps = {
    children: React.ReactNode,
    columns?: number
}

EntityDetailsLayout.Content = ({ children, columns = 2 }: ContentProps) => {
    const gridCols = columns === 1
        ? 'md:grid-cols-1'
        : 'md:grid-cols-8'

    return (
        <div className="flex flex-col justify-center items-center pb-6">
            <div className={`mx-auto grid grid-cols-1 ${gridCols} gap-6 w-full`}>
                {children}
            </div>
        </div>
    )
}

EntityDetailsLayout.Column = ({ children }: Props) => {
    //  bg-white rounded-2xl shadow-sm p-4
    return (
        <div className=" flex flex-col gap-6 md:col-span-4">
            {children}
        </div>
    )
}


EntityDetailsLayout.Grid = ({ children }: Props) => {
    return (
        <div className="flex flex-col ">
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