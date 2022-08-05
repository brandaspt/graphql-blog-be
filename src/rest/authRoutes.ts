import passport from "passport"
import express from "express"
const router = express.Router()

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["email", "profile"],
	})
)

router.get(
	"/google/callback",
	passport.authenticate("google", { successRedirect: "/graphql" }),
	req => {
		console.log("from cb")
		console.log(req.user)
		console.log(req.isAuthenticated())
	}
)

router.get(
	"/facebook",
	passport.authenticate("facebook", { scope: ["email", "public_profile"] })
)

router.get(
	"/facebook/callback",
	passport.authenticate("facebook", {
		failureRedirect: "/",
	}),
	(req, res) => {
		console.log("req", req.user)
		res.json(req.user)
	}
)

export default router
