import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { EditProfilePage } from "../pages/EditProfilePage";
import { getUserProfilePage } from "../api/ProfileAPI";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";

export const LoaderProfile = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["profile"],
        queryFn: () => getUserProfilePage(),
        retry: false,
    });

    if (isLoading) {
        return <BlueLoader />;
    }

    if (isError) {
        return (
            <TextMessage
                align="center"
                color="red"
                text="Ha ocurrido un error"
            />
        );
    }

    if (!data) {
        return (
            <TextMessage
                align="center"
                color="red"
                text="No se ha encontrado el contenido"
            />
        );
    }

    return <EditProfilePage data={data} />;
};
