import { Prisma } from "@prisma/client"
import {
	enumType,
	idArg,
	inputObjectType,
	mutationField,
	nullable,
	objectType,
	queryField,
	stringArg,
} from "nexus"
import { adminOnly } from "../rules/adminOnly"
import { NexusGenInputs } from "../nexus/nexus-typegen"
import { hashPassword } from "../utils"
import { PostType } from "./post"

const getWhereClause = (
	authorId: string,
	filter?: NexusGenInputs["UserPostsFilterInput"] | null
): Prisma.PostModelWhereInput => ({
	AND: [
		{ authorId: authorId },
		{ published: true },
		filter?.searchQuery
			? {
					OR: [
						{
							content: {
								contains: filter.searchQuery,
								mode: "insensitive",
							},
						},
						{
							title: {
								contains: filter.searchQuery,
								mode: "insensitive",
							},
						},
					],
			  }
			: {},
	],
})

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
		t.nullable.email("email")
		t.field("role", { type: RoleType })
		t.date("createdAt")
		t.date("updatedAt")
		t.connectionField("posts", {
			type: PostType,
			additionalArgs: {
				filter: nullable(UserPostsFilterInput),
			},
			description: "List of user's published posts",
			nodes: ({ id }, { filter, first, after }, { prisma }) =>
				prisma.postModel.findMany({
					where: getWhereClause(id, filter),
					take: first + 1,
					skip: after ? 1 : 0,
					cursor: after ? { id: after } : undefined,
				}),
			extendConnection: t => {
				t.int("totalCount", {
					resolve: (
						{ id }, // Nexus bug. Typed as {edges, pageInfo} but it's actually the parent (User)
						{
							filter,
						}: {
							filter?: NexusGenInputs["UserPostsFilterInput"] | null
						},
						{ prisma }
					) =>
						prisma.postModel.count({
							where: getWhereClause(id, filter),
						}),
				})
			},
		})
	},
})

// Inputs

export const UserPostsFilterInput = inputObjectType({
	name: "UserPostsFilterInput",
	definition: t => {
		t.nullable.string("searchQuery")
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
			prisma.userModel.findUnique({ where: { id } }),
	})

	t.field("getUserMe", {
		type: nullable(UserType),
		description: "Get authenticated user",
		resolve: async (_, __, { prisma, session, req }) => {
			console.log(session)
			console.log(req.user)
			if (!session.userId) throw new Error("Not Authenticated")
			return prisma.userModel.findUnique({ where: { id: session.userId } })
		},
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
				return await prisma.userModel.create({
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
			prisma.userModel.update({ where: { id }, data: { role } }),
	})
})
