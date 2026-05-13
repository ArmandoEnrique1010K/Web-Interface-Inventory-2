export const handleApplyStyleColor = (color: 'blue' | 'green' | 'red' | 'green-outline' | 'red-outline' | 'gray' | 'none' | 'blue-outline' | 'gray-outline') => {
    if (color === 'blue') {
        return "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500 text-white"
    }

    if (color === 'green') {
        return "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500 text-white"
    }

    if (color === 'red') {
        return "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 text-white"
    }

    if (color === 'green-outline') {
        return "bg-emerald-100 hover:bg-emerald-200 focus-visible:ring-green-500 text-emerald-700"
    }

    if (color === 'red-outline') {
        return "bg-red-100 hover:bg-red-200 focus-visible:ring-red-500 text-red-700"
    }
    if (color === 'blue-outline') {
        return "bg-blue-100 hover:bg-blue-200 focus-visible:ring-blue-500 text-blue-700"
    }

    if (color === 'gray-outline') {
        return "bg-slate-100 hover:bg-slate-200 focus-visible:ring-slate-500 text-slate-700"
    }


    if (color === 'gray') {
        return "bg-slate-600 hover:bg-slate-700 focus-visible:ring-slate-500 text-white"
    }

    if (color === 'none') {
        return 'bg-gray-100! text-black! opacity-100!'
    }
}

