import { useQuery } from "@tanstack/react-query";
import { TextMessage } from "@/components/TextMessage";
import { getUserProfile } from "../api/UserAPI";
import { UpdateProfileForm } from "./UpdateProfileForm";

export const ProfileEditLoader = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['profile'],
        queryFn: () => getUserProfile(),
        retry: false,
    })


    if (isLoading) {
        return <TextMessage text='Cargando...' align='left' color='black' />
    }

    if (isError) {
        return <TextMessage text='Ha ocurrido un error' align='left' color='red' />
    }

    if (data) return (
        <UpdateProfileForm data={data} />
    )
}
