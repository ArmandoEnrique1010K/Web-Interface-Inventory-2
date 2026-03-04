import { ButtonLink } from "@/ui/ButtonLink"

// TODO: SE PODRIA MEJORAR ESTE COMPONENTE
export const Error = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-10">No se ha encontrado el contenido</p>
        <ButtonLink size={"small"} text={"Ir al dashboard"} to={"/"} color={"blue"} />
      </div>
    </div>
  )
}