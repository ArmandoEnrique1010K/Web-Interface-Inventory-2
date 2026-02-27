import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type Props = {
    id: string; // Id del input
    label?: string; // Etiqueta del input
    placeholder?: string; // Texto que se muestra en el input
    type: 'text' | 'password' | 'email' | 'number' | 'hidden'; // Tipo de input (text, password, email, etc)
    defaultValue?: string; // Valor por defecto del input
    errorMessage: FieldError | undefined, // Mensaje de error
    functionEnabled: UseFormRegisterReturn // Funcion que se ejecuta al cambiar el valor del input
}

export const InputText = ({ id, label, placeholder, type, defaultValue, errorMessage, functionEnabled }: Props) => {

    // Estado para ver contraseñas
    const [showPassword, setShowPassword] = useState(false);

    // No se mostrara nada si el input es hidden
    const applyStylesInHiddenInput = () => {
        if (type === 'hidden') {
            return 'hidden'
        }
        return 'flex flex-col space-y-1 w-full pt-2'
    }

    return (
        <div className={applyStylesInHiddenInput()}>
            <label className="text-md font-bold" htmlFor={id}>{label}</label>
            <div className="flex flex-col gap-1">
                <div className="flex flex-row gap-1">

                    <input
                        className="outline-none focus:outline-none p-2 border border-gray-700 bg-gray-100 rounded w-full"
                        type={type === "password" && showPassword ? "text" : type}
                        placeholder={placeholder}
                        id={id}
                        {...functionEnabled}
                        defaultValue={defaultValue}
                    />
                    {
                        type === "password" && (
                            <button className="p-2 border border-gray-700 rounded bg-gray-100 hover:cursor-pointer hover:bg-gray-200" type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeSlashIcon className="w-6 h-6" /> : <EyeIcon className="w-6 h-6" />}
                            </button>
                        )
                    }
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
