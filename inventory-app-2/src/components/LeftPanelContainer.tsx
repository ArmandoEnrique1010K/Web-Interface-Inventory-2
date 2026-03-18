import { Subtitle } from './Subtitle'

type Props = {
    subtitle: string
    children?: React.ReactNode
}

export const LeftPanelContainer = ({ subtitle, children }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            <Subtitle>{subtitle}</Subtitle>
            {children}
        </div>
    )
}

type DetailProps = {
    label: string
    children: React.ReactNode
}

LeftPanelContainer.Detail = ({ label, children }: DetailProps) => {
    return (
        <div>
            <span className="font-semibold">{label}: </span>
            {children}
        </div>
    )
}

LeftPanelContainer.DetailsGroup = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="space-y-1">
            {children}
        </div>
    )
}

type ImageProps = {
    url?: string
    name?: string
    legend?: string
}

LeftPanelContainer.Image = ({ url, name, legend }: ImageProps) => {
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