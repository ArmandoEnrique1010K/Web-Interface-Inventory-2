import { z } from "zod"

export const userSchema = z.object({
    id: z.number(),
    firstname: z.string(),
    lastname: z.string(),
    fullName: z.string(), // Nombre y apellidos en un solo campo
    email: z.string(),
    dni: z.string(),
    password: z.string(),
    roles: z.array(z.string()),
    status: z.boolean(),
})

export const roleSchema = z.object({
    id: z.number(),
    label: z.string(),

    operator: z.boolean(),
    secretary: z.boolean(),
    admin: z.boolean(),
})

export type User = z.infer<typeof userSchema>
export type Role = z.infer<typeof roleSchema>


export type UserRegisterForm = Pick<User, 'firstname' | 'lastname' | 'email' | 'dni' | 'password'> & Pick<Role, 'operator' | 'secretary' | 'admin'>;
export type RolesForm = Pick<Role, "operator" | "secretary" | "admin">;
export type ProfileForm = Pick<User, 'firstname' | 'lastname' | 'email' | 'dni'>

export type RoleItem = Pick<Role, 'id' | 'label'>
export type UserItem = Pick<User, 'id' | 'firstname' | 'lastname' | 'dni' | 'roles' | 'status'>
export type UserByKeywordItem = Pick<User, 'id' | 'fullName' | 'email' | 'dni'>
export type UserDetailsItem = Pick<User, 'firstname' | 'lastname' | 'email' | 'dni' | 'roles'>
export type UserRolesDetails = Pick<Role, "operator" | "secretary" | "admin">