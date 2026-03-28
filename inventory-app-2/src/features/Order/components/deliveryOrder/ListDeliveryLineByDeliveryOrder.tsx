import { EntityListLayout } from '@/layout/entity/EntityListLayout'
import { Button } from '@/ui/Button'

export const ListDeliveryLineByDeliveryOrder = () => {
    return (
        <>
            <EntityListLayout isCompact>
                <EntityListLayout.Header actions={
                    <Button type={"submit"} color={"blue"} text="Nueva linea"></Button>
                }>
                </EntityListLayout.Header>

            </EntityListLayout>

        </>
    )
}
