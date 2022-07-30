import {
	enumType,
	idArg,
	inputObjectType,
	mutationField,
	nullable,
	objectType,
	queryField,
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
		t.email("email")
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

export const userQueries = queryField(t => {
	t.field("getUser", {
		type: nullable(UserType),
		args: {
			id: idArg(),
		},
		resolve: async (_, { id }, { prisma }) =>
			prisma.user.findUnique({ where: { id } }),
	})
})

// Inputs

export const RegisterUserInput = inputObjectType({
	name: "RegisterUserInput",
	definition(t) {
		t.string("name")
		t.email("email")
		t.string("password")
	},
})

// Mutations

export const userMutations = mutationField(t => {
	t.field("registerUser", {
		type: UserType,
		args: { data: RegisterUserInput },
		resolve: async (_, { data: { email, name, password } }, { prisma }) => {
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
		args: {
			id: idArg(),
			role: RoleType,
		},
		authorize: (_, __, { prisma, session }) => adminOnly({ prisma, session }),
		resolve: (_, { id, role }, { prisma }) =>
			prisma.user.update({ where: { id }, data: { role } }),
	})
})
