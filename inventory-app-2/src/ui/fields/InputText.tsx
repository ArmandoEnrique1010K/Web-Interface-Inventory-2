import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

type Props = {
    id: string; // Id del input
    label?: string; // Etiqueta del input
    placeholder?: string; // Texto que se muestra en el input
    type: 'text' | 'password' | 'email' | 'number' | 'hidden'; // Tipo de input (text, password, email, etc)
    errorMessage?: FieldError | undefined, // Mensaje de error
    functionEnabled?: UseFormRegisterReturn // Funcion que se ejecuta al cambiar el valor del input con react hook form
    max?: number
}

export const InputText = ({ id, label, placeholder, type, errorMessage, functionEnabled, max }: Props) => {

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
                        onWheel={(e) => e.currentTarget.blur()}

                        // Controla el valor introducido si es de tipo number y si hay un valor para la prop max
                        onInput={(e) => {
                            if (type === "number" && max) {
                                const target = e.currentTarget
                                if (target.value.length > max) {
                                    // Acorta el valor introducido a 6 caracteres
                                    target.value = target.value.slice(0, max)
                                }
                            }
                        }}

                        {...functionEnabled}
                        {...(type === "number" ? { max } : {})}

                    />
                    {
                        type === "password" && (
                            <button className="p-2 border border-gray-700 rounded bg-gray-100 hover:cursor-pointer hover:bg-gray-200" type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeSlashIcon className="size-6" /> : <EyeIcon className="size-6" />}
                            </button>
                        )
                    }
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
