type CreditSectionProps = {
    title: string;
    children: React.ReactNode;
    type: "list" | "text";
};

export const CreditSection = ({
    title,
    children,
    type,
}: CreditSectionProps) => {
    return (
        <section className="space-y-3 ">
            <h2 className="text-2xl font-bold">{title}</h2>

            {type === "list" && (
                <ul className="list-disc space-y-1">{children}</ul>
            )}
            {type === "text" && <div>{children}</div>}
        </section>
    );
};
