type Props = {
    dataContainer: React.ReactNode
}

export const SummaryPanelContainer = ({ dataContainer }: Props) => {
    return (
        <div className="pt-8 pb-2 w-full">
            {dataContainer}
        </div>
    )
}
