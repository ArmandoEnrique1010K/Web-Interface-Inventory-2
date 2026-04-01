import { handleFormatDateTime } from '@/utils/handleFormatDateTime'
import DateTimePicker from 'react-datetime-picker'


type Props = {
    name: string,
    label: string,
    value: string
    onChange: (value: string) => void;
}

export const InputDateTimeFilter = ({ name, label, value, onChange }: Props) => {
    return (

        <div className="flex flex-col w-full space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor={name}>{label}:</label>

            <DateTimePicker
                id={name}
                value={value ? new Date(value) : null}
                onChange={(date: Date | null) => {
                    if (!date) {
                        onChange("");
                        return;
                    }


                    onChange(handleFormatDateTime(date));
                }}
                format="y-MM-dd HH:mm:ss"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500" yearPlaceholder="yyyy"
                monthPlaceholder="mm"
                dayPlaceholder="dd"
                hourPlaceholder="hh"
                minutePlaceholder="mm"
                secondPlaceholder="ss"
                // Oculta los iconos
                calendarIcon={null}

                // Oculta el reloj
                disableClock
            />
        </div>
    )
}
