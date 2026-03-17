import { Subtitle } from './Subtitle'

type Props = {
    subtitle: string
    selectButtons?: React.ReactNode,
    details: {
        name: string,
        value: string | React.ReactNode,
        condition?: React.ReactNode // Condicion que debe ser verdadera para mostrar el detalle
        isButton?: boolean // Aplica estilos si contiene un boton
    }[]
}

export const RightPanelContainer = ({ subtitle, selectButtons, details }: Props) => {
    return (
        <>
            <Subtitle>{subtitle}</Subtitle>
            {
                selectButtons && <>
                    <div className="flex items-center justify-center gap-3">
                        {selectButtons}
                    </div>
                </>
            }
            <div className="grid grid-cols-1 gap-y-2 text-sm mt-2">
                {
                    // Solamente no se mostrara el detalle si es falsa la condicion (no cuenta si no se ha definido la condicion)
                    details.map(d => (
                        (d.condition === undefined || d.condition === true) &&
                        <div className='grid grid-cols-2 items-center' key={d.name}>
                            <div key={d.name} className="font-semibold">{d.name}:</div>
                            <div className={`${d.isButton ? 'flex justify-start' : ''}`}>{d.value}</div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}
