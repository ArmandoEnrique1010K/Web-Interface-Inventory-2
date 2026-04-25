type Props = {
    children: string;
};

export const Subtitle = ({ children }: Props) => {
    return <h2 className="sm:text-3xl text-2xl font-bold">{children}</h2>;
};
