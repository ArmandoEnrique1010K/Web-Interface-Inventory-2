export const handleApplyStyleColor = (color: 'blue' | 'green' | 'red' | 'gray' | 'none') => {
    if (color === 'blue') {
        return "bg-blue-600 hover:bg-blue-700"
    }

    if (color === 'green') {
        return "bg-green-600 hover:bg-green-700"
    }

    if (color === 'red') {
        return "bg-red-600 hover:bg-red-700"
    }

    if (color === 'gray') {
        return "bg-gray-600 hover:bg-gray-700"
    }

    if (color === 'none') {
        return 'bg-gray-100! text-black! opacity-100!'
    }
}

