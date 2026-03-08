import type { User } from "@/features/User/types";

export type UserProfileForm = Pick<User, "firstname" | "lastname" | "email" | "dni">;
