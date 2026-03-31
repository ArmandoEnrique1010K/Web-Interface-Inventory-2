import { ChevronDownIcon } from "@heroicons/react/24/outline";

type Props = {
    name: string
    label: string; // Etiqueta del input
    options: { value: string, label: string }[],
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    textInNullOption?: string,
    value: string
    disabled?: boolean
}


export const SelectOptionFilter = ({ name, label, options, onChange, textInNullOption, value, disabled = false }: Props) => {
    return (

        // relative: Es una propiedad de Tailwind CSS que establece la posición relativa de un elemento. 
        // Los elementos con posición relativa se posicionan en relación con su posición original en el flujo de diseño. 
        // Esto significa que los elementos relativos pueden ser movidos o desplazados utilizando las propiedades de 
        // desplazamiento (top, right, bottom, left). 
        // La propiedad relative es útil cuando se desea posicionar elementos hijos dentro de un elemento padre relativo.
        <div className="flex flex-col w-full space-y-1 relative">
            <label className="text-sm font-medium text-slate-700" htmlFor={name}>{label}:</label>

            {/* appearance-none quita el icono del selector "<" */}
            <select className={`appearance-none
            outline-none focus:outline-none border border-slate-300 rounded-lg 
            px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                ${disabled ? 'cursor-not-allowed text-gray-400 bg-slate-100' : 'cursor-pointer'} `}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
            >
                {textInNullOption && <option value="">
                    {textInNullOption || "Seleccione una opción"}
                </option>}

                {
                    options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))
                }
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-2 top-7 flex items-center h-8">
                <ChevronDownIcon className="size-6 text-black font-bold" />
            </div>

        </div>
    )
}
