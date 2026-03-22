
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
        <div className="flex flex-col w-full space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor={name}>{label}:</label>

            <select className="outline-none focus:outline-none border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
            >
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
    )
}
