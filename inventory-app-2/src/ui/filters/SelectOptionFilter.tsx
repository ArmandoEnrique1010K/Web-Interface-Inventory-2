
type Props = {
    name: string
    label: string; // Etiqueta del input
    options: { value: string, label: string }[],
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    textInNullOption?: string,
    value: string
}


export const SelectOptionFilter = ({ name, label, options, onChange, textInNullOption, value }: Props) => {
    return (
        <div className="flex flex-col w-full">
            <label className="text-md font-bold" htmlFor={name}>{label}</label>
            <div className="flex flex-row gap-1">

                <select className="outline-none focus:outline-none p-2 border border-gray-700 bg-gray-100 rounded w-full"
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                >
                    {/* NOTA: LA VISTA PARPADEA AL CARGAR LA OPCION SELECCIONADA POR VALUE */}
                    {textInNullOption && <option value="">
                        {textInNullOption || "Seleccione una opción"}
                    </option>}

                    {
                        options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))
                    }
                </select>

            </div>
        </div>
    )
}
