
// Convierte un Date a string en formato YYYY-MM-DD

// onChange = {(date: Date | null) => {
//     if (date) {
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         field.onChange(`${year}-${month}-${day}`);
//     } else {
//         field.onChange(null);
//     }
// }}


export const handleFormatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}