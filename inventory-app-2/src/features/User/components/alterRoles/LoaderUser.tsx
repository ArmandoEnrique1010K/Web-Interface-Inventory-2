import { useQuery } from "@tanstack/react-query";
import { getUserRoles } from "../../api/UserAPI";
import { TextMessage } from "@/components/TextMessage";
import { AlterRolesUserModal } from "./AlterRolesUserModal";
import { BlueLoader } from "@/components/BlueLoader/BlueLoader";

type Props = {
    userId: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoaderUser = ({ userId, setShowModal }: Props) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["roles", userId],
        queryFn: () => getUserRoles(userId),
        retry: 1,
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

    return (
        <AlterRolesUserModal
            data={data}
            userId={userId}
            setShowModal={setShowModal}
        />
    );
};
