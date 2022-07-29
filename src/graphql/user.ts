import {
	enumType,
	idArg,
	mutationField,
	nullable,
	objectType,
	queryField,
	stringArg,
} from "nexus"
import { adminOnly } from "../authorization/adminOnly"
import { hashPassword } from "../utils"
import { PostType } from "./post"

export const RoleType = enumType({ name: "Role", members: ["USER", "ADMIN"] })

export const UserType = objectType({
	name: "User",
	definition(t) {
		t.id("id")
		t.string("name")
		t.string("email")
		t.field("role", { type: "Role" })
		t.date("createdAt")
		t.date("updatedAt")
		t.list.field("posts", {
			type: PostType,
			resolve: ({ id }, _, { prisma }) =>
				prisma.post.findMany({
					where: { AND: [{ authorId: id }, { published: true }] },
				}),
		})
	},
})

// Queries

export const getUser = queryField("getUser", {
	type: nullable(UserType),
	args: {
		id: idArg(),
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
		id: idArg(),
		role: RoleType,
	},
	authorize: (_, __, { prisma, session }) => adminOnly({ prisma, session }),
	resolve: (_, { id, role }, { prisma }) =>
		prisma.user.update({ where: { id }, data: { role } }),
})
