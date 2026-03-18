type Props = {
    children: React.ReactNode
}

export const SummaryPanelContainer = ({ children }: Props) => {
    return (
        <div className="pt-8 pb-2 w-full">
            {children}
        </div>
    )
}
