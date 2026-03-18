import { Subtitle } from './Subtitle'

type Props = {
    subtitle: string
    // selectButtons?: React.ReactNode,
    // details: {
    //     name: string,
    //     value: string | React.ReactNode,
    //     condition?: React.ReactNode // Condicion que debe ser verdadera para mostrar el detalle
    //     isButton?: boolean // Aplica estilos si contiene un boton
    // }[]

    children?: React.ReactNode

}

export const RightPanelContainer = ({ subtitle, children }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            <Subtitle>{subtitle}</Subtitle>
            {children}
        </div>
    )
}

type ActionsProps = {
    children: React.ReactNode
}

RightPanelContainer.Actions = ({ children }: ActionsProps) => {
    return (
        <div className="flex items-center justify-center gap-3">
            {children}
        </div>

    )
}


RightPanelContainer.DetailsGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-1 gap-y-2 text-sm mt-2">
            {children}
        </div>
    )
}
type DetailProps = {
    label: string
    children: React.ReactNode
    isButton?: boolean
}

RightPanelContainer.Detail = ({ label, children, isButton }: DetailProps) => {
    return (
        <div className="grid grid-cols-2 items-center">
            <div className="font-semibold">{label}:</div>
            <div className={isButton ? 'flex justify-start' : ''}>
                {children}
            </div>
        </div>
    )
}

