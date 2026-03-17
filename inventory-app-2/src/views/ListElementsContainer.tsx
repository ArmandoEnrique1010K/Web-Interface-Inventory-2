import { Title } from "@/components/Title";

type Props = {
    title: string;
    buttonsContainer?: React.ReactNode
    searchParamsContainer?: React.ReactNode
    dataContainer: React.ReactNode;
}

// Componente generico para mostrar datos en una lista
export const ListElementsContainer = ({ title, buttonsContainer, searchParamsContainer, dataContainer }: Props) => {
    return (
        <div className='p-6'>
            <Title>{title}</Title>
            {
                buttonsContainer && (
                    <div className='flex flex-row mb-6 gap-4'>
                        {buttonsContainer}
                    </div>
                )
            }

            <div className="space-y-6">
                {searchParamsContainer}
                {dataContainer}
            </div>
        </div>
    )
}
