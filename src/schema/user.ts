import { User } from "@prisma/client"
import { mutationType, queryType, stringArg } from "nexus"
import { IContext } from "../interface"

export const query = queryType({
	definition(t) {
		t.field("hello", {
			type: "String",
			resolve: () => "worlds",
		})
	},
})

export const mutation = mutationType({
	definition(t) {
		t.boolean("registerUser", {
			args: {
				name: stringArg(),
				email: stringArg(),
				password: stringArg(),
			},
			resolve: async (_, { email, name, password }: Omit<User, "id">, { prisma }: IContext) => {
				try {
					const newUser = await prisma.user.create({ data: { email, name, password } })
					console.log(newUser)
					return true
				} catch (err) {
					const error = err as Error
					return new Error(error.message)
				}
			},
		})
	},
})
