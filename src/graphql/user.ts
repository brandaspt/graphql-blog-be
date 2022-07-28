import {
	enumType,
	mutationField,
	nullable,
	objectType,
	queryField,
	stringArg,
} from "nexus"
import { hashPassword, isAdmin } from "../utils"

export const RoleType = enumType({ name: "Role", members: ["USER", "ADMIN"] })

export const UserType = objectType({
	name: "User",
	definition(t) {
		t.string("id")
		t.string("name")
		t.string("email")
		t.field("role", { type: "Role" })
		t.date("createdAt")
		t.date("updatedAt")
	},
})

// Queries

export const getUser = queryField("getUser", {
	type: nullable(UserType),
	args: {
		id: stringArg(),
	},
	resolve: async (_, { id }, { prisma }) =>
		prisma.user.findFirst({ where: { id } }),
})

// Mutations

export const registerUser = mutationField("registerUser", {
	type: UserType,
	args: {
		name: stringArg(),
		email: stringArg(),
		password: stringArg(),
	},
	resolve: async (_, { email, name, password }, { prisma }) => {
		try {
			const hashedPassword = await hashPassword(password)
			return await prisma.user.create({
				data: { email, name, password: hashedPassword },
			})
		} catch (err) {
			console.error(err)
			throw new Error("Error creating user")
		}
	},
})

export const changeUserRole = mutationField("changeUserRole", {
	type: UserType,
	args: {
		id: stringArg(),
		role: RoleType,
	},
	resolve: async (_, { id, role }, { prisma, session }) => {
		const userMe = await prisma.user.findFirst({
			where: { id: session.userId },
		})
		if (!isAdmin(userMe?.role)) throw new Error("Not Authorized")
		return prisma.user.update({ where: { id }, data: { role } })
	},
})
