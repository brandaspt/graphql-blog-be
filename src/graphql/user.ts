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

const RoleType = enumType({
	name: "Role",
	members: [
		{
			name: "USER",
			description:
				"Allowed to view published posts. Not allowed to create posts.",
		},
		{
			name: "ADMIN",
			description: "Allowed to create posts. Allowed to change user Role.",
		},
	],
})

export const UserType = objectType({
	name: "User",
	definition: t => {
		t.id("id")
		t.string("name")
		t.email("email")
		t.field("role", { type: RoleType })
		t.date("createdAt")
		t.date("updatedAt")
		t.list.field("posts", {
			type: PostType,
			description: "List of user's published posts",
			resolve: ({ id }, _, { prisma }) =>
				prisma.post.findMany({
					where: { AND: [{ authorId: id }, { published: true }] },
				}),
		})
	},
})

// Queries

export const userQueries = queryField(t => {
	t.field("getUser", {
		type: nullable(UserType),
		description: "Get user by id",
		args: {
			id: idArg(),
		},
		resolve: async (_, { id }, { prisma }) =>
			prisma.user.findUnique({ where: { id } }),
	})
})

// Mutations

export const userMutations = mutationField(t => {
	t.field("registerUser", {
		type: UserType,
		args: {
			name: stringArg(),
			password: stringArg(),
			email: "EmailAddress",
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

	t.field("changeUserRole", {
		type: UserType,
		description: "Change user's role. Allowed to admins only",
		args: {
			id: idArg(),
			role: RoleType,
		},
		authorize: (_, __, { prisma, session }) => adminOnly({ prisma, session }),
		resolve: (_, { id, role }, { prisma }) =>
			prisma.user.update({ where: { id }, data: { role } }),
	})
})
