import { Role } from "@prisma/client"

export const isAdmin = (role?: Role) => role === "ADMIN"
