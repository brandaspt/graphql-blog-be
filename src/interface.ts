import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"

export interface IContext {
	req: Request
	res: Response
	prisma: PrismaClient
}
