type Props = {
    imageUrl: string;
};

export const PreviewImage = ({ imageUrl }: Props) => {
    return (
        <div className="flex flex-col w-full pb-6">
            <img
                src={`${imageUrl}`}
                alt={`${imageUrl}`}
                className="max-h-80 max-w-full object-contain bg-white shadow-sm rounded-xl border border-gray-200"
            />
        </div>
    );
};
