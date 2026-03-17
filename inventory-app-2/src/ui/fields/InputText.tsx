import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

type Props = {
    id: string; // Id del input
    label?: string; // Etiqueta del input
    placeholder?: string; // Texto que se muestra en el input
    type: 'text' | 'email' | 'number' | 'hidden'; // Tipo de input (text, password, email, etc)
    errorMessage?: FieldError | undefined, // Mensaje de error
    functionEnabled?: UseFormRegisterReturn // Funcion que se ejecuta al cambiar el valor del input con react hook form
    max?: number
}

export const InputText = ({ id, label, placeholder, type, errorMessage, functionEnabled, max }: Props) => {

    // No se mostrara nada si el input es hidden
    const applyStylesInHiddenInput = () => {
        if (type === 'hidden') {
            return 'hidden'
        }
        return 'flex flex-col w-full space-y-1'
    }

    console.log(errorMessage) // Siempre imprime undefined

    return (
        <div className={applyStylesInHiddenInput()}>
            <label className="text-sm font-medium text-slate-700" htmlFor={id}>{label}</label>

            <input
                className="outline-none focus:outline-none border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type={type}
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
                <div className='min-h-5'>
                    <p className="text-red-600 text-xs mt-1">
                        {errorMessage?.message}
                    </p>
                </div>
            }
        </div>
    )
}
