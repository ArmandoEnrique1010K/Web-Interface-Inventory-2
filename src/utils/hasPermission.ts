const rolePriority: Record<string, number> = {
    ROLE_USER: 1,
    ROLE_OPERATOR: 2,
    ROLE_ADMIN: 3,
};

export const hasPermission2 = (userRole: string, requiredRole: string) => {
    return rolePriority[userRole] >= rolePriority[requiredRole];
};
// const getHighestRole = (roles: string[]) => {
//     return roles.reduce((highest, current) =>
//         rolePriority[current] > rolePriority[highest] ? current : highest,
//     );
// };

// export const hasPermission = (userRoles: string[], requiredRole: string) => {
//     const highestRole = getHighestRole(userRoles);
//     return rolePriority[highestRole] >= rolePriority[requiredRole];
// };
