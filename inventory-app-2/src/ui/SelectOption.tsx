import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
type Props = {
    id: string; // Id del input
    label?: string; // Etiqueta del input
    defaultValue?: string; // Valor por defecto del input
    errorMessage: FieldError | undefined, // Mensaje de error
    functionEnabled: UseFormRegisterReturn // Funcion que se ejecuta al cambiar el valor del input
    options: { value: string, label: string }[],
    value?: string
}
export const SelectOption = ({ id, label, errorMessage, functionEnabled, options, defaultValue, value }: Props) => {
    return (
        <div className="flex flex-col space-y-1 w-full pt-2">
            <label className="text-md font-bold" htmlFor={id}>{label}</label>
            <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1">

                    <select className="outline-none focus:outline-none p-2 border border-gray-700 bg-gray-100 rounded w-full"
                        id={id}
                        {...functionEnabled}
                        defaultValue={defaultValue}

                        // NOTA: SOLAMENTE SE UTILIZA value EN FORMULARIOS QUE SIRVEN PARA EDITAR UN REGISTRO
                        value={value || defaultValue}
                    >
                        <option value="">
                            Seleccione una opción
                        </option>

                        {
                            options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))
                        }
                    </select>

                </div>
                <div className="min-h-6">
                    <p className="text-red-700 text-sm">
                        {errorMessage?.message}
                    </p>
                </div>
            </div>
        </div>
    )
}

