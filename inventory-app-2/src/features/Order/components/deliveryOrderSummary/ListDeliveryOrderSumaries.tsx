import { useQuery } from "@tanstack/react-query";
import { getSummaryByDeliveryOrder } from "../../api/DeliveryOrderSummaryAPI";
import type { DeliveryOrderSummaryItem } from "../../schemas/items";
import { TableContainer } from "@/components/TableContainer";
import { TableRowContainer } from "@/components/TableRowContainer";
import { BaseTableCell } from "@/components/BaseTableCell";

type Props = {
    deliveryOrderId: number;
};

export const ListDeliveryOrderSumaries = ({ deliveryOrderId }: Props) => {
    const { data, isError, isLoading } = useQuery({
        queryKey: ["deliveryOrder", "summary", deliveryOrderId],
        queryFn: () => getSummaryByDeliveryOrder(deliveryOrderId!),
    });
    const prepareTableData = (data: DeliveryOrderSummaryItem) => {
        return data?.map((region) => {
            const regionRowSpan = region.subregions.reduce(
                (acc, sub) => acc + sub.items.length,
                0,
            );

            const subregions = region.subregions.map((sub) => ({
                ...sub,
                rowSpan: sub.items.length,
            }));

            return {
                ...region,
                rowSpan: regionRowSpan,
                subregions,
            };
        });
    };

    const tableData = prepareTableData(data as DeliveryOrderSummaryItem);

    return (
        <TableContainer
            title="Sumatoria de cantidades"
            headers={[
                "Región",
                "Subregión",
                "Producto",
                "Modelo",
                "Cantidad total",
            ]}
            isError={isError}
            isLoading={isLoading}
            isEmpty={!data?.length}
        >
            {tableData?.map((region) =>
                region.subregions?.map((sub, subIndex) =>
                    sub.items?.map((item, itemIndex) => (
                        <TableRowContainer
                            key={`${region.regionId}-${sub.subregionId}-${item.modelId}`}
                        >
                            {/* REGION */}
                            {subIndex === 0 && itemIndex === 0 && (
                                <BaseTableCell
                                    rowSpan={region.rowSpan}
                                    data={region.regionName}
                                />
                            )}
                            {/* SUBREGION */}
                            {itemIndex === 0 && (
                                <BaseTableCell
                                    rowSpan={sub.rowSpan}
                                    data={sub.subregionName}
                                />
                            )}
                            <BaseTableCell data={item.productName} />
                            <BaseTableCell data={item.modelName} />
                            <BaseTableCell data={item.totalQuantity} />
                        </TableRowContainer>
                    )),
                ),
            )}
        </TableContainer>
    );
};
