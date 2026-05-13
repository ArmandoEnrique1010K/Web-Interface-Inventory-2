import { LinkText } from "@/components/LinkText";

type CreditItemProps = {
    type: "div" | "li";
    url?: string;
    children: React.ReactNode;
};

export const CreditItem = ({ type, url, children }: CreditItemProps) => {
    return (
        <>
            {type === "li" && (
                <li className="ml-6 text-base">
                    {url ? (
                        <LinkText
                            to={url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {children}
                        </LinkText>
                    ) : (
                        children
                    )}
                </li>
            )}
            {type === "div" && <div className="text-base">{children}</div>}
        </>
    );
};
