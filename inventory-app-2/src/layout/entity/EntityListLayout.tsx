import { Title } from "@/components/Title";

// COMPOSICION DE COMPONENTES
type Props = {
    children: React.ReactNode;
    isCompact?: boolean;
};

export const EntityListLayout = ({ children, isCompact }: Props) => {
    return <div className={`${isCompact ? "" : "sm:p-6 p-4"}`}>{children}</div>;
};

type HeaderProps = {
    title?: string;
    actions?: React.ReactNode;
};

EntityListLayout.Header = ({ title, actions }: HeaderProps) => {
    return (
        <>
            {title && <Title>{title}</Title>}

            {actions && (
                <div className="flex flex-row sm:mb-6 mb-4 gap-4">
                    {actions}
                </div>
            )}
        </>
    );
};

EntityListLayout.Content = ({ children }: Props) => {
    return <div className="sm:space-y-6 space-y-4">{children}</div>;
};
