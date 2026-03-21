import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Button } from "../Button";

type Props = {
    id: string; // Id del input
    label: string; // Etiqueta del input
    placeholder?: string; // Texto que se muestra en el input
    errorMessage?: FieldError | undefined, // Mensaje de error
    functionEnabled?: UseFormRegisterReturn // Funcion que se ejecuta al cambiar el valor del input con react hook form
}

export const InputPassword = ({ id, label, placeholder, errorMessage, functionEnabled }: Props) => {

    // Estado para ver contraseñas
    const [showPassword, setShowPassword] = useState(false);



    return (
        <div className={`flex flex-col w-full space-y-1`}>
            <label className="text-sm font-medium text-slate-700" htmlFor={id}>{label}:</label>

            <div className="flex flex-row gap-2 ">

                <input
                    className="outline-none focus:outline-none border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    id={id}
                    onWheel={(e) => e.currentTarget.blur()}
                    {...functionEnabled}
                />


                <Button
                    size="small"
                    showIconOnMobile
                    icon={showPassword ? <EyeSlashIcon className="size-6" /> : <EyeIcon className="size-6" />}
                    type={"button"} color={showPassword ? 'gray-outline' : 'blue-outline'} onClick={() => setShowPassword(!showPassword)} />

            </div>

            {
                <div className='min-h-5'>
                    <p className="text-red-600 text-xs mt-1">
                        {errorMessage?.message}
                    </p>
                </div>
            }
        </div>
    )
}
