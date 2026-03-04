import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
type Props = {
    id: string; // Id del input
    name?: string
    label?: string; // Etiqueta del input
    errorMessage?: FieldError | undefined, // Mensaje de error
    functionEnabled?: UseFormRegisterReturn // Funcion que se ejecuta al cambiar el valor del input
    options: { value: string, label: string }[],
    textInNullOption?: string,
    editableValue?: string //* SOLAMENTE EN CAMPOS QUE NO TENGAN REACT HOOK FORM
}
export const SelectOption = ({ id, name, label, errorMessage, functionEnabled, options, textInNullOption, editableValue }: Props) => {
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
                        // NOTA: NO SE DEBEN UTILIZAR LAS PROPS value Y defaultValue, REACT HOOK FORM ya tiene esas props
                        // defaultValue={defaultValue}
                        // value={value || defaultValue}
                        value={editableValue}

                    >
                        {/* TODO: LA VISTA PARPADEA AL CARGAR LA OPCION SELECCIONADA POR VALUE */}
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
        </div>
    )
}

