import {
    Controller,
    type Control,
    type FieldPath,
    type FieldValues,
} from "react-hook-form";
import DateTimePicker from "react-datetime-picker";
import { handleFormatDateTimeWithoutT } from "@/utils/handleFormatDateTime";
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
    errorMessage,
}: InputDateTimeProps<T>) {
    // Algunos elementos de formularios personalizados (como react-datetime-picker o selectores de fecha/tiempo
    // avanzados) no generan un <input> HTML directo, sino que renderizan varios elementos internos y envoltorios
    // <div> para manejar la UI y los eventos. En estos casos, asignar un id al contenedor no vincula correctamente
    // el <label>, porque el label solo funciona con un <input> o <textarea> que tenga ese id. Por eso, en lugar
    // de id y htmlFor, se debe usar aria-label directamente en el componente, que proporciona la información
    // accesible a lectores de pantalla y herramientas de accesibilidad sin depender de la relación label–input
    // tradicional.

    return (
        <div className="flex flex-col w-full space-y-1">
            {/* Un elemento label no puede existir si no tiene un atributo htmlFor */}
            <div className="text-sm font-medium text-slate-700">{label}:</div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    return (
                        <DateTimePicker
                            // En lugar de id se utiliza un aria-label
                            aria-label={id}
                            name={name}
                            value={field.value ? new Date(field.value) : null}
                            onBlur={field.onBlur}
                            format="y-MM-dd HH:mm:ss"
                            onChange={(date) => {
                                if (!date) {
                                    field.onChange(null);
                                    return;
                                }

                                const newDate = new Date(date);

                                const previousDate = field.value
                                    ? new Date(field.value)
                                    : null;

                                const userChangedTime =
                                    previousDate &&
                                    (newDate.getHours() !==
                                        previousDate.getHours() ||
                                        newDate.getMinutes() !==
                                            previousDate.getMinutes() ||
                                        newDate.getSeconds() !==
                                            previousDate.getSeconds());

                                // Si NO cambió la hora → aplicar 23:59:59
                                if (!userChangedTime) {
                                    newDate.setHours(23, 59, 59);
                                }

                                field.onChange(
                                    handleFormatDateTimeWithoutT(newDate),
                                );
                            }}
                            // react-datetime-picker no aplica focus al contenedor
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                            yearPlaceholder="yyyy"
                            // Placeholder (propio para cada campo)
                            monthPlaceholder="mm"
                            dayPlaceholder="dd"
                            hourPlaceholder="hh"
                            minutePlaceholder="mm"
                            secondPlaceholder="ss"
                            disableClock
                            // Oculta los iconos
                            calendarIcon={null}
                            clearIcon={null}
                        />
                    );
                }}
            />

            <div className="min-h-5">
                <p className="text-red-600 text-xs mt-1">{errorMessage}</p>
            </div>
        </div>
    );
}
