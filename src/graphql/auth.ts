import { mutationField, stringArg } from "nexus"
import { verifyPassword } from "../utils"

export const login = mutationField("login", {
	type: "Boolean",
	args: {
		email: stringArg(),
		password: stringArg(),
	},
	resolve: async (_, { email, password }, { prisma, session }) => {
		try {
			const user = await prisma.user.findFirstOrThrow({ where: { email } })
			const isCorrectPassword = await verifyPassword({
				plain: password,
				hashed: user.password,
			})
			if (!isCorrectPassword) throw new Error("Invalid Credentials")
			session.userId = user.id

			return true
		} catch (err) {
			console.error(err)
			throw new Error("Error creating user")
		}
	},
})

export const logout = mutationField("logout", {
	type: "Boolean",
	resolve: (_, __, { session }) => {
		session.destroy(err => {
			if (err) {
				console.log("Error destroying session:")
				console.error(err)
				throw new Error("Error destroying session")
			}
		})
		return true
	},
})
