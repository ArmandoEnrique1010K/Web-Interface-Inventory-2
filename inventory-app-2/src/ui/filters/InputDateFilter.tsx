import { handleFormatDate } from "@/utils/handleFormatDate";
import { es } from "date-fns/locale/es";
import DatePicker, { registerLocale } from "react-datepicker";

type Props = {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
registerLocale("spanish", es);

export const InputDateFilter = ({ name, label, value, onChange }: Props) => {
    return (
        <div className="flex flex-col w-full space-y-1">
            <label
                className="text-sm font-medium text-slate-700"
                htmlFor={name}
            >
                {label}:
            </label>

            <DatePicker
                id={name}
                selected={value ? new Date(value + "T12:00:00") : null}
                onChange={(date: Date | null) => {
                    if (date) {
                        onChange({
                            target: { value: handleFormatDate(date) },
                        } as React.ChangeEvent<HTMLInputElement>);
                    } else {
                        onChange({
                            target: { value: "" },
                        } as React.ChangeEvent<HTMLInputElement>);
                    }
                }}
                dateFormat="yyyy-MM-dd"
                placeholderText="año-mes-dia"
                wrapperClassName="w-full"
                className="outline-none focus:outline-none p-2 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                showPopperArrow={false}
                // Ubicacion del calendario
                popperPlacement="bottom-start"
                locale={"spanish"}
            />
        </div>
    );
};
