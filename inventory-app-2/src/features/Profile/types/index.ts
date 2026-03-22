import type { User } from "@/features/User/types";

export type UserProfilePageForm = Pick<User, "firstname" | "lastname" | "email" | "dni">;
