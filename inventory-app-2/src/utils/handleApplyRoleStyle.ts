const rolesColors: { role: string; style: string }[] = [
    {
        role: 'Usuario',
        style: 'bg-gray-100 text-gray-700'
    },
    {
        role: 'Operador',
        style: 'bg-blue-100 text-blue-700'
    },
    {
        role: 'Secretario',
        style: 'bg-green-100 text-green-700'
    },
    {
        role: 'Administrador',
        style: 'bg-red-100 text-red-700'
    }
]

export const handleApplyRoleStyle = (role: 'Usuario' | 'Operador' | 'Secretario' | 'Administrador') => {
    return `${rolesColors.find(roleColor => roleColor.role === role)?.style}`
}