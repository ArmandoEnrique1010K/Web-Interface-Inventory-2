import { handleFormatDate } from "@/utils/handleFormatDate"
import { es } from "date-fns/locale/es"
import DatePicker, { registerLocale } from "react-datepicker"

type Props = {
    name: string,
    label: string,
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}
registerLocale('spanish', es)

export const InputDateFilter = ({ name, label, value, onChange }: Props) => {
    return (
        <div>
            <label className="text-md font-bold" htmlFor={name}>{label}</label>

            <DatePicker
                id={name}
                selected={value ? new Date(value + "T12:00:00") : null}
                onChange={(date: Date | null) => {
                    if (date) {
                        onChange({ target: { value: handleFormatDate(date) } } as React.ChangeEvent<HTMLInputElement>)
                    } else {
                        onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
                    }
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="Selecciona una fecha"
                wrapperClassName="w-full"

                className="outline-none focus:outline-none p-2 border border-gray-700 bg-gray-100 rounded w-full"
                showPopperArrow={false}
                popperPlacement="bottom-end"
                locale={'spanish'}
            />
        </div>
    )
}
