import type { ProductItem } from "@/features/Product/types"

export const generateSizes = (product: ProductItem): React.ReactNode => {
    const sizes: string[] = []

    if (Number(product.length) > 0) {
        sizes.push(`${product.length} cm. (L)`)
    }

    if (Number(product.width) > 0) {
        sizes.push(`${product.width} cm. (An)`)
    }

    if (Number(product.height) > 0) {
        sizes.push(`${product.height} cm. (Al)`)
    }

    if (sizes.length === 0) {
        return "-"
    }

    return sizes.join(' x ')
}
