import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { EditProfilePage } from "../views/EditProfilePage";
import { getUserProfilePage } from "../api/ProfileAPI";

export const LoaderProfile = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getUserProfilePage(),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />
    }

    if (data) return (
        <EditProfilePage data={data} />
    )
}
