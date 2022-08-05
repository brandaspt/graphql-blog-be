import passport from "passport"
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth"
import { Strategy as FacebookStrategy } from "passport-facebook"
import { prisma } from "../db"

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_APP_ID!,
			clientSecret: process.env.GOOGLE_APP_SECRET!,
			callbackURL: "http://localhost:5000/auth/google/callback/",
		},
		async (_accessToken, _refreshToken, profile, done) => {
			const { id, provider, emails, displayName } = profile

			const user = await prisma.authProvidersModel
				.findUnique({
					where: { provider_id: { id, provider } },
				})
				.user()

			if (user) {
				return done(null, user)
			} else {
				const email = emails?.[0]?.value || null
				const newUser = await prisma.userModel.create({
					data: {
						email,
						name: displayName,
						authProviders: { create: { id, provider } },
					},
				})
				return done(null, newUser)
			}
		}
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

passport.serializeUser((user, done) => {
	console.log("ser", user)
	done(null, user)
})

// passport.deserializeUser(async (id: string, done) => {
// 	const user = await prisma.userModel.findUnique({ where: { id } })
// 	done(null, user)
// })
