import { User } from "@prisma/client"
import {
	enumType,
	intArg,
	mutationField,
	nonNull,
	nullable,
	objectType,
	queryField,
	stringArg,
} from "nexus"
import { hashPassword } from "../utils/password"

export const RoleType = enumType({ name: "Role", members: ["USER", "ADMIN"] })

export const UserType = objectType({
	name: "User",
	definition(t) {
		t.int("id")
		t.string("name")
		t.string("email")
		t.field("role", { type: "Role" })
		t.float("createdAt")
		t.float("updatedAt")
	},
})

// Queries

export const getUser = queryField("getUser", {
	type: nullable(UserType),
	args: {
		id: nonNull(intArg()),
	},
	resolve: (_, { id }: Pick<User, "id">, { prisma }) =>
		prisma.user.findFirst({ where: { id } }),
})

// Mutation

export const registerUser = mutationField("registerUser", {
	type: UserType,
	args: {
		name: stringArg(),
		email: stringArg(),
		password: stringArg(),
	},
	resolve: async (
		_,
		{ email, name, password }: Pick<User, "email" | "name" | "password">,
		{ prisma }
	) => {
		try {
			const hashedPassword = await hashPassword(password)
			return prisma.user.create({
				data: { email, name, password: hashedPassword },
			})
		} catch (err) {
			console.error(err)
			return new Error("Error creating user")
		}
	},
})
