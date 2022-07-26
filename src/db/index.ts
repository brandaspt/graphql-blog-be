import { PrismaClient } from "@prisma/client"

export const getPrismaClient = () => new PrismaClient({ log: ["error", "info", "query", "warn"] })
