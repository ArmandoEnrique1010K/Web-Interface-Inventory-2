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
            className='border border-gray-700 rounded-xl px-4 py-4 mb-6 space-y-2'
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
