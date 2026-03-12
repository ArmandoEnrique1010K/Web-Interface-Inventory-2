import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { registerLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
import { handleFormatDate } from "@/utils/handleFormatDate";

// Registrar el idioma español para el calendario
registerLocale('spanish', es)

type InputDateProps<T extends FieldValues> = {
    id: string;
    label: string;
    name: FieldPath<T>;
    control: Control<T>;
    errorMessage?: string;
};
// TODO: INTENTAR QUITAR LA PROP NAME

// TODO: INVESTIGAR COMO SE HA INFERIDO EL TIPO DE DATO DE T
// TODO: PROBLEMA AL SELECCIONAR UNA FECHA, NO SELECCIONA LA FECHA AL PULSAR EN EL CALENDARIO
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
            <div className="flex flex-col w-full gap-1">
                <div className="flex flex-row w-full">
                    <Controller

                        name={name}
                        control={control}
                        render={({ field }) => {

                            // Convierte de String a Date
                            // T12:00:00 Evita bugs de zona horaria
                            const selectedDate =
                                field.value ? new Date(field.value + "T12:00:00") : null;
                            return (

                                <DatePicker
                                    id={id}
                                    name={name}
                                    // Modifica el selected para convertir string a Date si es necesario
                                    // selected={field.value ? new Date(field.value + "T12:00:00") : null}
                                    selected={selectedDate}
                                    // Modifica el onChange para convertir Date a string YYYY-MM-DD
                                    // onChange={(date: Date | null) => {
                                    //     if (date) {
                                    //         field.onChange(handleFormatDate(date));
                                    //     } else {
                                    //         field.onChange(null);
                                    //     }
                                    // }}
                                    onChange={(date: Date | null) => {
                                        if (!date) {
                                            field.onChange("");
                                            return;
                                        }

                                        // Aplica el formato de YYYY-MM-DD
                                        field.onChange(handleFormatDate(date));
                                    }}

                                    onBlur={field.onBlur}
                                    // TODO: EN ALGUNA FUTURA ACTUALIZACIÓN SE PUEDE CORREGIR EL FORMATO DE FECHA
                                    dateFormat="yyyy-MM-dd"
                                    placeholderText="Selecciona una fecha"
                                    // WrapperClassName es una propiedad que permite asignar una clase CSS personalizada al contenedor que envuelve todo el componente DatePicker
                                    wrapperClassName="w-full"
                                    className="w-full outline-none focus:outline-none p-2 border border-gray-700 bg-gray-100 rounded"
                                    showPopperArrow={false}
                                    // Alinea el calendario a lado derecho y abajo del campo seleccionador
                                    popperPlacement="bottom-end"
                                    // Se coloca el valor de como se ha denominado al idioma registrado
                                    locale={'spanish'}

                                />
                            );
                        }}
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
