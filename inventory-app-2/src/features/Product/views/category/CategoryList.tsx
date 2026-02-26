import { useQuery } from '@tanstack/react-query'
import { listAllCategories } from '../../api/CategoryAPI'
import type { CategoryItem } from '../../types'
import { Button } from '@/shared/ui/Button'

export const CategoryList = () => {

    const { data, isLoading } = useQuery({
        queryKey: ['list-categories'],
        queryFn: listAllCategories
    })

    if (isLoading) {
        return <h1>Cargando...</h1>
    }


    return (
        <div>
            <h1 className='text-4xl font-bold pb-6'>Categorias</h1>

            <div className='pb-8'>
                <Button
                    size="large"
                    text="Nueva categoria"
                    type="link"
                    to="/products/categories/new"
                    color="blue"
                />
            </div>


            <table className='w-full border-collapse border border-gray-300 overflow-hidden'>
                <thead>
                    <tr className='bg-gray-800 text-white'>
                        <th className='border border-gray-300 px-4 py-3 text-left font-semibold '>ID</th>
                        <th className='border border-gray-300 px-4 py-3 text-left font-semibold '>Nombre</th>
                        <th className='border border-gray-300 px-4 py-3 text-left font-semibold '>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((category: CategoryItem) => (
                        <tr key={category.id} className='bg-white hover:bg-blue-100 transition-colors'>
                            <td className='border border-gray-300 px-4 py-3'>{category.id}</td>
                            <td className='border border-gray-300 px-4 py-3'>{category.name}</td>
                            <td className='border border-gray-300  text-center'>
                                <Button
                                    size="small"
                                    text="Editar"
                                    type="link"
                                    to={`/products/categories/edit/${category.id}`}
                                    color="blue"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}
