import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
type Props = {
    id: string; // Id del input
    name?: string
    label?: string; // Etiqueta del input
    defaultValue?: string; // Valor por defecto del input
    hasErrors: boolean // Verifica si existen mensajes de errores
    errorMessage?: FieldError | undefined, // Mensaje de error
    functionEnabled?: UseFormRegisterReturn // Funcion que se ejecuta al cambiar el valor del input
    options: { value: string, label: string }[],
    value?: string,
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void,
    nullOption?: boolean,
    textInNullOption?: string
}
export const SelectOption = ({ id, name, label, hasErrors, errorMessage, functionEnabled, options, defaultValue, value, onChange, nullOption, textInNullOption }: Props) => {
    return (
        <div className="flex flex-col space-y-1 w-full pt-2">
            <label className="text-md font-bold" htmlFor={id}>{label}</label>
            <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1">

                    <select className="outline-none focus:outline-none p-2 border border-gray-700 bg-gray-100 rounded w-full"
                        id={id}
                        name={name}
                        // NOTA: functionEnabled tiene unas propiedades internas, en la cual una de ellas es el name
                        {...functionEnabled}
                        // NOTA: SOLAMENTE SE UTILIZA value EN FORMULARIOS QUE SIRVEN PARA EDITAR UN REGISTRO
                        // defaultValue={defaultValue}
                        // value={value || defaultValue}


                        onChange={functionEnabled?.onChange || onChange}
                    >
                        {nullOption && <option value="">
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
                    hasErrors && (
                        <div className="min-h-6">
                            <p className="text-red-700 text-sm">
                                {errorMessage?.message}
                            </p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

