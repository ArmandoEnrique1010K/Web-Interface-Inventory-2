import { ButtonLink } from "@/ui/ButtonLink";
import { HomeIcon } from "@heroicons/react/24/outline";

export const Error = () => {
    return (
        <div className="md:min-h-[calc(100dvh+4rem)] min-h-[calc(100dvh-3rem)]  flex flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-6">404</h1>
                <p className="text-xl text-gray-600 mb-12">
                    No se ha encontrado el contenido
                </p>
                <ButtonLink
                    icon={<HomeIcon />}
                    size={"large"}
                    text={"Ir a inicio"}
                    to={"/"}
                    color={"blue"}
                    applyMinWidth
                    showIconOnMobile
                    showTextOnMobile
                />
            </div>
        </div>
    );
};
