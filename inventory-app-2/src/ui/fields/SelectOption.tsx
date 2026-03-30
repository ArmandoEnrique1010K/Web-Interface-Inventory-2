import { ChevronDownIcon } from '@heroicons/react/24/outline';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
type Props = {
    id: string; // Id del input
    name?: string
    label: string; // Etiqueta del input
    errorMessage?: FieldError | undefined, // Mensaje de error
    functionEnabled?: UseFormRegisterReturn // Funcion que se ejecuta al cambiar el valor del input
    options: { value: string, label: string }[],
    textInNullOption?: string,
    disabled?: boolean
}
export const SelectOption = ({ id, name, label, errorMessage, functionEnabled, options, textInNullOption, disabled }: Props) => {
    return (
        <div className="flex flex-col w-full space-y-1 relative">
            <label className="text-sm font-medium text-slate-700" htmlFor={id}>{label}:</label>
            <div className="flex flex-col gap-1">

                <select className={`appearance-none
                outline-none focus:outline-none border border-slate-300 rounded-lg 
                px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                ${disabled ? 'cursor-not-allowed text-gray-400 bg-slate-100' : 'cursor-pointer'} `}
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
                <div className="pointer-events-none absolute inset-y-0 right-2 top-7 h-8 flex items-center">
                    <ChevronDownIcon className="size-6" />
                </div>

                {

                    <div className="min-h-5">
                        <p className="text-red-600 text-xs mt-1">
                            {errorMessage?.message}
                        </p>
                    </div>
                }
            </div>
        </div >
    )
}

