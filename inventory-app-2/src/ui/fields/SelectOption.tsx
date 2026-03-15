import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
type Props = {
    id: string; // Id del input
    name?: string
    label?: string; // Etiqueta del input
    errorMessage?: FieldError | undefined, // Mensaje de error
    functionEnabled?: UseFormRegisterReturn // Funcion que se ejecuta al cambiar el valor del input
    options: { value: string, label: string }[],
    textInNullOption?: string,
    disabled?: boolean
}
export const SelectOption = ({ id, name, label, errorMessage, functionEnabled, options, textInNullOption, disabled }: Props) => {
    return (
        <div className="flex flex-col space-y-1 w-full pt-2">
            <label className="text-md font-bold" htmlFor={id}>{label}</label>
            <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1">

                    <select className={`outline-none focus:outline-none p-2 border border-gray-700 bg-gray-100 rounded w-full ${disabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-black'} `}
                        id={id}
                        name={name}
                        // NOTA: functionEnabled tiene unas propiedades internas, en la cual una de ellas es el name
                        {...functionEnabled}

                        disabled={disabled}
                    // SI UTILIZO DEFAULT VALUE, MUESTRA EL VALOR, PERO AL RECARGAR LA PAGINA SE PIERDE
                    // defaultValue={editableValue}

                    // PERO SI UTILIZO VALUE, NO PERMITE CAMBIAR EL VALOR
                    // value={editableValue}

                    // Solución, utiliza value cuando no utilices React Hook Form
                    // {...(!functionEnabled && editableValue !== undefined
                    //     ? { value: editableValue }
                    //     : {})}

                    // Pero como siempre es un componente de React HOOK FORM, se puede omitir la condicion

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
                {

                    <div className="min-h-6">
                        <p className="text-red-700 text-sm">
                            {errorMessage?.message}
                        </p>
                    </div>
                }
            </div>
        </div >
    )
}

