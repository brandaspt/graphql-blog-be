import express from "express"
import { ApolloServer } from "apollo-server-express"
import { getContext } from "./context"
import { getSchema } from "./graphql/schema"
import RedisSession from "connect-redis"
import session from "express-session"
import { isProd } from "./utils"
import { redisClient } from "./redis"
import passport from "passport"
import { prisma } from "./db"
import authRoutes from "./rest/authRoutes"
import "./config/passport"

const main = async () => {
	const app = express()

	const redisStore = RedisSession(session)

	app.use(
		session({
			store: new redisStore({ client: redisClient }),
			secret: process.env.SESSION_SECRET!,
			name: "blog-gql-api",
			resave: false,
			saveUninitialized: false,
			proxy: !isProd(),
			cookie: {
				httpOnly: isProd(),
				maxAge: 1000 * 60 * 60 * 24,
				secure: isProd(),
				sameSite: "lax",
			},
		})
	)

	app.use(passport.initialize())
	app.use(passport.session())

	app.use("/auth", authRoutes)

	const apolloServer = new ApolloServer({
		schema: getSchema(),
		context: ({ req, res }) =>
			getContext({ req, res, redis: redisClient, prisma }),
	})

	await apolloServer.start()

	apolloServer.applyMiddleware({
		app,
		cors: { origin: ["https://studio.apollographql.com"], credentials: true },
	})
	!isProd && app.set("trust proxy", 1)

	const PORT = process.env.PORT || 5000

	app.listen(PORT, () => {
		console.log(`Server started on port ${PORT}`)
	})
}

main().catch(err => {
	console.error(err)
})
