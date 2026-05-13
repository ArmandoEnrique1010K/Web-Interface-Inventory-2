import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GeneralError } from "@/types/index";
import { toast } from "sonner";
import { Button } from "@/ui/Button";
import { useForm } from "react-hook-form";
import { changeStatusLocation } from "../../api/LocationAPI";

export const StatusLocationButton = ({
    locationId,
    locationStatus,
}: {
    locationId: number;
    locationStatus: boolean;
}) => {
    const { handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => changeStatusLocation(locationId),
        retry: false,
        onError: (error: unknown) => {
            const e = error as GeneralError;
            if (e.type === "GENERAL_ERROR") {
                toast.error(e.message);
                return;
            }
        },
        onSuccess: (data) => {
            toast.success(data);
            queryClient.invalidateQueries({
                queryKey: ["location", locationId],
            });
            queryClient.invalidateQueries({ queryKey: ["locations"] });
        },
    });

    return (
        <form onSubmit={handleSubmit(() => mutate())} className="text-center ">
            <Button
                text={locationStatus ? "Activo" : "Inactivo"}
                type="submit"
                size="small"
                color={locationStatus ? "green-outline" : "red-outline"}
                showTextOnMobile
            />
        </form>
    );
};
