import express from "express"
import dotenv from "dotenv"
import { getSchema } from "./schema"
import { ApolloServer } from "apollo-server-express"
import { getPrismaClient } from "./db"
import { IContext } from "./interface"

const main = async () => {
	dotenv.config()

	const app = express()

	const schema = getSchema()
	const prisma = getPrismaClient()

	const apolloServer = new ApolloServer({
		schema,
		context: ({ req, res }): IContext => ({ req, res, prisma }),
	})

	await apolloServer.start()

	apolloServer.applyMiddleware({ app })

	const PORT = process.env.PORT || 5000

	app.listen(PORT, () => {
		console.log(`Server started on port ${PORT}`)
	})
}

main().catch(err => {
	console.error(err)
})
