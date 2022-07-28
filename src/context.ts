import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { Session } from "express-session"
import Redis from "ioredis"
import { prisma } from "./db"

interface MySession extends Session {
	userId?: string
}

export interface Context {
	prisma: PrismaClient
	req: Request
	res: Response
	session: MySession
	redis: Redis
}

export const getContext = ({
	req,
	res,
	redis,
}: Omit<Context, "prisma" | "session">): Context => ({
	prisma,
	req,
	res,
	session: req.session,
	redis,
})
