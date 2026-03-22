import { Subtitle } from '../Subtitle'

type Props = {
    subtitle?: string
    // selectButtons?: React.ReactNode,
    // details: {
    //     name: string,
    //     value: string | React.ReactNode,
    //     condition?: React.ReactNode // Condicion que debe ser verdadera para mostrar el detalle
    //     isButton?: boolean // Aplica estilos si contiene un boton
    // }[]

    children?: React.ReactNode

}

export const PanelContainer = ({ subtitle, children }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            {children}
        </div>
    )
}

type ActionsProps = {
    children: React.ReactNode
}

PanelContainer.Actions = ({ children }: ActionsProps) => {
    return (
        <div className="flex items-center justify-center gap-3">
            {children}
        </div>

    )
}


PanelContainer.DetailsGrid = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-1 gap-y-3 text-sm mt-2">
            {children}
        </div>
    )
}
type DetailProps = {
    label: string
    children: React.ReactNode
    isButton?: boolean
}

PanelContainer.Detail = ({ label, children, isButton }: DetailProps) => {
    return (
        <div className="grid grid-cols-2 items-center">
            <div className="text-sm text-gray-500">{label}:</div>
            <div className={isButton ? 'flex justify-start' : 'text-md'}>
                {children}
            </div>
        </div>
    )
}
type ImageProps = {
    url?: string
    name?: string
    legend?: string
}
PanelContainer.Image = ({ url, name, legend }: ImageProps) => {
    return (
        <div className="flex flex-col items-center gap-3">

            <div className="w-full h-auto object-contain bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden">
                {url ? (
                    <img
                        src={url}
                        alt={name}
                        className="max-h-100 max-w-full object-contain"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">Sin imagen</span>
                )}
            </div>

            {legend && (
                <div className="text-sm text-center">
                    <span className="font-semibold">{legend}</span>
                </div>
            )}

        </div>
    )
}