import { Title } from "@/components/Title";

type Props = {
    title: string;
    buttonsContainer?: React.ReactNode
    leftPanelContainer: React.ReactNode
    rightPanelContainer: React.ReactNode
    summaryPanelContainer?: React.ReactNode
}

// TODO: ARREGLAR ESTE CONTENEDOR DE UN ELEMENTO
export const ElementContainer = ({ title, buttonsContainer, leftPanelContainer, rightPanelContainer, summaryPanelContainer }: Props) => {
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
            <div className="flex flex-col justify-center items-center">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-8 gap-6 w-full">
                    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 lg:col-span-5">
                        {leftPanelContainer}
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4 lg:col-span-3">
                        {rightPanelContainer}
                    </div>

                </div>

                {summaryPanelContainer}
            </div>
        </div>
    )
}
