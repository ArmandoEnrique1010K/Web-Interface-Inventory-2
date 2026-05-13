import { Button } from "../Button"

type Props<T> = {
    label: string
    group: T[]
    value: string
    onChange: (value: string) => void
}

export const ButtonsGroupFilter = <T extends { id: number; name: string }>({
    label,
    group,
    value,
    onChange
}: Props<T>) => {

    return (
        <>
            <p className="text-sm font-medium">{label}:</p>

            <div className="flex flex-wrap gap-2">
                {group.map(item => (
                    <Button
                        key={item.id}
                        type="button"
                        size="small"
                        text={item.name}
                        color="blue"
                        onClick={() => onChange(item.id.toString())}
                        aditionalStyles={
                            `${value === item.id.toString()

                                ? 'bg-slate-600 hover:bg-slate-700 focus-visible:ring-slate-500'
                                : ''}`
                        }
                        showTextOnMobile
                    />
                ))}
            </div>
        </>
    )
}