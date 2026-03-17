import { Subtitle } from './Subtitle'

type Props = {
    subtitle: string
    details: { name: string, value: string | React.ReactNode }[],
    image?: { url: string, name: string }
    legend?: string,
    extraDetails?: { name: string, value: string }[]
}

export const LeftPanelContainer = ({ subtitle, details, image, legend, extraDetails }: Props) => {
    return (
        <>
            <Subtitle>{subtitle}</Subtitle>
            <div className="space-y-1">
                {
                    details.map(d => (
                        <div>
                            <span className="font-semibold">{d.name}: </span>{d.value}</div>

                    ))
                }
            </div>
            {
                image && <div className="flex flex-col items-center gap-3">
                    {/* El tamaño de la imagen es variable */}
                    <div className={`w-full h-auto object-contain bg-gray-50 rounded-xl border flex items-center justify-center overflow-hidden`}>
                        {image.url
                            ? (
                                <img
                                    src={image.url}
                                    alt={image.name}
                                    className="max-h-100 max-w-full object-contain"
                                />
                            )
                            : <span className="text-gray-400 text-sm">Sin imagen</span>
                        }
                    </div>

                    {
                        legend && <div className="text-sm text-center">
                            <span className="font-semibold">{legend}</span>
                        </div>

                    }

                </div>
            }
            {
                extraDetails && <div className='flex flex-col text-lg'>
                    {
                        extraDetails.map(d => (
                            <div><span className="font-semibold">{d.name}:</span> {d.value}</div>

                        ))
                    }
                </div>
            }

        </>
    )
}
