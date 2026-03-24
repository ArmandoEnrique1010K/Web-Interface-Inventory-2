import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import DateTimePicker from "react-datetime-picker";


import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { handleFormatDateTime } from "@/utils/handleFormatDateTime";

type InputDateTimeProps<T extends FieldValues> = {
    id: string;
    label: string;
    name: FieldPath<T>;
    control: Control<T>;
    errorMessage?: string;
};
export function InputDateTime<T extends FieldValues>({
    id,
    label,
    name,
    control,
    errorMessage
}: InputDateTimeProps<T>) {

    return (
        <div className="flex flex-col w-full space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor={id}>{label}:</label>
            <Controller
                name={name}
                control={control}
                // TODO: APLICAR NUEVOS ESTILOS AL CALENDARIO Y AL RELOJ
                render={({ field }) => {
                    return (
                        <DateTimePicker
                            id={id}
                            name={name}
                            // TODO: NO DEBE SER ASI EL DATO ENVIADO: "2025-12-31T05:00:00.000Z", SINO ASI: "2026-09-01 23:59:59"
                            value={field.value ? new Date(field.value) : null}
                            onChange={(date) => {
                                // Guardar como ISO (recomendado)
                                field.onChange(date ? handleFormatDateTime(date) : null);
                            }}
                            onBlur={field.onBlur}
                            format="y-MM-dd HH:mm:ss"
                            // react-datetime-picker no aplica focus al contenedor
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500" yearPlaceholder="yyyy"
                            // Placeholder (propio para cada campo)
                            monthPlaceholder="mm"
                            dayPlaceholder="dd"
                            hourPlaceholder="hh"
                            minutePlaceholder="mm"
                            secondPlaceholder="ss"
                            // Oculta los iconos
                            calendarIcon={null}
                            clearIcon={null}
                        />
                    );
                }}
            />

            <div className='min-h-5'>
                <p className="text-red-600 text-xs mt-1">
                    {errorMessage}
                </p>
            </div>
        </div>
    )
}
