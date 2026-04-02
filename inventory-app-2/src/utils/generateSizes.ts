export const generateSizes = (product: {
    length: number | null;
    width: number | null;
    height: number | null;
}): React.ReactNode => {
    const sizes: string[] = [];

    const { height, length, width } = product;

    if (length && length > 0) {
        sizes.push(`${product.length} cm. (L)`);
    }

    if (width && width > 0) {
        sizes.push(`${product.width} cm. (An)`);
    }

    if (height && height > 0) {
        sizes.push(`${product.height} cm. (Al)`);
    }

    if (sizes.length === 0) {
        return "-";
    }

    return sizes.join(" x ");
};
