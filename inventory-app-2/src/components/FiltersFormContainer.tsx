import { Button } from "@/ui/Button"
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline"

type Props = {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    children: React.ReactNode
}

export const FiltersFormContainer = ({
    onSubmit,
    children
}: Props) => {
    return (
        <form
            className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4'
            autoComplete="off" noValidate
            onSubmit={onSubmit}
        >
            {children}

            <div className='flex justify-end'>
                <Button text="Filtrar" icon={<MagnifyingGlassCircleIcon />} type="submit" color='green' size='large' aditionalStyles='mt-4 m' />
            </div>
        </form>
    )
}
