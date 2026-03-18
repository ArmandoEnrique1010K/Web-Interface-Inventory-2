type Props = {
    name: string
    label: string; // Etiqueta del input
    options: { value: string, label: string }[],
    onChange?: (selectedValues: string[]) => void,
    value: string[] // Cambiado de string a string[]
}

export const SelectCheckboxFilter = ({ name, label, options, onChange, value }: Props) => {
    const handleCheckboxChange = (optionValue: string, isChecked: boolean) => {
        let newSelectedValues: string[];

        if (isChecked) {
            // Agregar el valor si está marcado
            newSelectedValues = [...value, optionValue.toString()];
        } else {
            // Remover el valor si está desmarcado
            newSelectedValues = value.filter(v => v !== optionValue.toString());
        }

        onChange?.(newSelectedValues);
        // console.log(newSelectedValues)
    }

    return (
        <div className="flex flex-col w-full space-y-1">
            <label className="text-sm font-medium text-slate-700">{label}:</label>
            <div className="flex flex-col space-y-1">
                {options.map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id={`${name}-${option.value}`}
                            name={name}
                            value={option.value}
                            checked={value.includes(option.value)}
                            onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100  border border-slate-300 rounded-lg outline-none focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        />
                        <label
                            htmlFor={`${name}-${option.value}`}
                            className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    )
}