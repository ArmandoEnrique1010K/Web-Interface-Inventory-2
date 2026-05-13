import { ButtonLink } from "@/ui/ButtonLink";
import { HomeIcon } from "@heroicons/react/24/outline";

type Props = {
    type?: "404" | "500";
};

export const Error = ({ type = "500" }: Props) => {
    return (
        <div className="md:min-h-[calc(100dvh+4rem)] min-h-[calc(100dvh-3rem)]  flex flex-col items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800 mb-6">
                    {type === "404" ? "404" : "500"}
                </h1>
                <p className="text-xl text-gray-600 mb-12">
                    {type === "404"
                        ? "No se ha encontrado el contenido"
                        : "Ha ocurrido un error"}
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
