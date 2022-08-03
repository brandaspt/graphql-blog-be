import express from "express"
import { ApolloServer } from "apollo-server-express"
import { getContext } from "./context"
import { getSchema } from "./graphql/schema"
import RedisSession from "connect-redis"
import session from "express-session"
import { isProd } from "./utils"
import { redisClient } from "./redis"
import passport from "passport"
import { Strategy as FacebookStrategy } from "passport-facebook"
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth"

const main = async () => {
	const app = express()

	const redisStore = RedisSession(session)

	const apolloServer = new ApolloServer({
		schema: getSchema(),
		context: ({ req, res }) => getContext({ req, res, redis: redisClient }),
	})

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

	passport.serializeUser((user, cb) => {
		cb(null, user)
	})

	passport.deserializeUser((user: Express.User, cb) => {
		cb(null, user)
	})

	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_APP_ID!,
				clientSecret: process.env.GOOGLE_APP_SECRET!,
				callbackURL: "http://localhost:5000/auth/google/callback/",
			},
			(_, __, profile, done) => done(null, profile)
		)
	)
	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_APP_ID!,
				clientSecret: process.env.FACEBOOK_APP_SECRET!,
				callbackURL: "http://localhost:5000/auth/facebook/callback/",
			},
			(_, __, profile, done) => done(null, profile)
		)
	)

	app.get(
		"/auth/google/",
		passport.authenticate("google", { scope: ["email", "profile"] })
	)
	app.get(
		"/auth/google/callback/",
		passport.authenticate("google", {
			failureRedirect: "/",
		}),
		(req, res) => {
			console.log("req", req.user)
			res.json(req.user)
		}
	)
	app.get(
		"/auth/facebook/",
		passport.authenticate("facebook", { scope: ["email", "public_profile"] })
	)
	app.get(
		"/auth/facebook/callback/",
		passport.authenticate("facebook", {
			failureRedirect: "/",
		}),
		(req, res) => {
			console.log("req", req.user)
			res.json(req.user)
		}
	)

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
