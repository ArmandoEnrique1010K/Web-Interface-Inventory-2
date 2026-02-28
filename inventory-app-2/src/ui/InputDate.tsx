import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"

type InputDateProps<T extends FieldValues> = {
    id: string;
    label: string;
    name: FieldPath<T>;
    control: Control<T>;
    errorMessage?: string;
};

// TODO: INVESTIGAR COMO SE HA INFERIDO EL TIPO DE DATO DE T

export function InputDate<T extends FieldValues>({
    id,
    label,
    name,
    control,
    errorMessage
}: InputDateProps<T>) {
    return (
        <div className="flex flex-col space-y-1 w-full pt-2">
            <label className="text-md font-bold" htmlFor={id}>{label}</label>
            <div className="flex flex-col w-full">
                <div className="flex flex-row w-full">
                    <Controller
                        name={name}
                        control={control}

                        render={({ field }) => (
                            <DatePicker
                                id={id}
                                selected={field.value ?? null}
                                onChange={(date: Date | null) => field.onChange(date)}
                                onBlur={field.onBlur}
                                // TODO: EN ALGUNA FUTURA ACTUALIZACIÓN SE PUEDE CORREGIR EL FORMATO DE FECHA
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Selecciona una fecha"
                                // WrapperClassName es una propiedad que permite asignar una clase CSS personalizada al contenedor que envuelve todo el componente DatePicker
                                wrapperClassName="w-full"
                                className="w-full outline-none focus:outline-none p-2 border border-gray-700 bg-gray-100 rounded"
                                showPopperArrow={false}
                            />
                        )}
                    />
                </div>
                <div className="min-h-6">
                    <p className="text-red-700 text-sm">
                        {errorMessage}
                    </p>
                </div>
            </div>
        </div>
    )
}
