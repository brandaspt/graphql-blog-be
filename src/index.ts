import express from "express"
import dotenv from "dotenv"
import { ApolloServer } from "apollo-server-express"
import { context } from "./context"
import { getSchema } from "./graphql/schema"

const main = async () => {
	dotenv.config()
	const app = express()

	const apolloServer = new ApolloServer({
		schema: getSchema(),
		context,
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
