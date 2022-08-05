import { mutationField, stringArg } from "nexus"
import { verifyPassword } from "../utils"

export const login = mutationField(t => {
	t.field("login", {
		type: "Boolean",
		args: {
			email: "EmailAddress",
			password: stringArg(),
		},
		resolve: async (_, { email, password }, { prisma, session }) => {
			try {
				const user = await prisma.userModel.findUniqueOrThrow({
					where: { email },
				})
				if (!user.password) throw new Error("No Password Set")
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

	t.field("logout", {
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
})
