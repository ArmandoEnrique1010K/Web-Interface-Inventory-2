type Props = {
    children: React.ReactNode
}

export const SummaryPanelContainer = ({ children }: Props) => {
    return (
        <div className="">
            {children}
        </div>
    )
}
