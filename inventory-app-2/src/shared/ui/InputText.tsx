import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
    id: string; // Id del input
    label: string; // Etiqueta del input
    placeholder: string; // Texto que se muestra en el input
    type: string; // Tipo de input (text, password, email, etc)
    errorMessage: FieldError | undefined, // Mensaje de error
    functionEnabled: UseFormRegisterReturn // Funcion que se ejecuta al cambiar el valor del input
}

export const InputText = ({ id, label, placeholder, type, errorMessage, functionEnabled }: Props) => {
    return (
        <div className="flex flex-col space-y-1 w-full pb-6">
            <label className="text-md font-bold" htmlFor={id}>{label}</label>
            <input
                className="outline-none focus:outline-none p-2 border border-gray-700 rounded w-full"
                type={type}
                placeholder={placeholder}
                id={id}
                {...functionEnabled}
            />
            {errorMessage?.message && (
                <p className="text-red-700">{errorMessage.message}</p>
            )}
        </div>
    )
}
