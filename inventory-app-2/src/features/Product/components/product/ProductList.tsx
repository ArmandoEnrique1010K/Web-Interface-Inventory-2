import { TitleContainer } from '@/components/TitleContainer'
import { Button } from '@/ui/Button'

export const ProductList = () => {
    return (
        <TitleContainer
            title="Productos"
            buttons={
                <Button
                    size="large"
                    text="Nuevo producto"
                    type="link"
                    to="/products/new"
                    color="blue"
                />
            }>

            TODO: TABLA DE PRODUCTOS
        </TitleContainer>



    )
}

