import { Prisma } from "@prisma/client"
import {
	arg,
	booleanArg,
	idArg,
	inputObjectType,
	mutationField,
	nullable,
	objectType,
	queryField,
	stringArg,
} from "nexus"
import { adminOnly, isMyPost } from "../authorization"
import { NexusGenInputs } from "../nexus/nexus-typegen"
import { UserType } from "./user"

const getWhereClause = (
	filter?: NexusGenInputs["FilterInput"] | null
): Prisma.PostWhereInput => ({
	AND: [
		{ published: true },
		{
			OR: filter?.searchQuery
				? [
						{
							content: {
								contains: filter?.searchQuery,
								mode: "insensitive",
							},
						},
						{
							title: {
								contains: filter?.searchQuery,
								mode: "insensitive",
							},
						},
				  ]
				: undefined,
		},
		{
			authorId: filter?.authorIds?.length
				? {
						in: filter?.authorIds,
				  }
				: undefined,
		},
	],
})

export const PostType = objectType({
	name: "Post",
	definition: t => {
		t.id("id")
		t.string("title")
		t.string("content")
		t.id("authorId")
		t.date("createdAt")
		t.date("updatedAt")
		t.field("author", {
			type: UserType,
			resolve: async ({ authorId }, _, { prisma }) =>
				prisma.user.findUniqueOrThrow({ where: { id: authorId } }),
		})
		t.nullable.date("publishedAt", {
			description:
				"Date when post was published. Null if post has never been published or has been unpublished",
		})
		t.boolean("published")
	},
})

// Inputs

export const FilterInput = inputObjectType({
	name: "FilterInput",
	definition: t => {
		t.nullable.string("searchQuery", {
			description:
				"If provided, returns only posts that contain the string on either the title or content",
		})
		t.nullable.list.id("authorIds", { description: "Filter by Author IDs" })
	},
})

// Queries

export const postQueries = queryField(t => {
	t.field("getPost", {
		type: nullable(PostType),
		args: {
			id: idArg(),
		},
		resolve: async (_, { id }, { prisma, session }) => {
			const post = await prisma.post.findUnique({ where: { id } })
			if (!post?.published && post?.authorId !== session.userId) {
				return null
			}
			return post
		},
	})

	t.connectionField("getPublishedPosts", {
		type: PostType,
		cursorFromNode: ({ id }) => id,
		additionalArgs: {
			filter: nullable(
				arg({
					type: FilterInput,
					description: "Filter posts",
				})
			),
		},
		nodes: async (_, { first, after, filter }, { prisma }) => {
			const posts = await prisma.post.findMany({
				where: getWhereClause(filter),
				take: first + 1,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined,
			})
			return posts
		},
		extendConnection: t => {
			t.int("totalCount", {
				resolve: (
					_,
					{ filter }: { filter?: NexusGenInputs["FilterInput"] | null },
					{ prisma }
				) =>
					prisma.post.count({
						where: getWhereClause(filter),
					}),
			})
		},
	})
})

// Mutations

export const postMutations = mutationField(t => {
	t.field("createPost", {
		type: PostType,
		args: {
			title: stringArg(),
			content: stringArg(),
		},
		authorize: (_, __, { prisma, session }) => adminOnly({ prisma, session }),
		resolve: (_, { title, content }, { prisma, session }) =>
			prisma.post.create({
				data: { content, title, authorId: session.userId! },
			}),
	})

	t.field("updatePost", {
		type: PostType,
		args: {
			id: idArg(),
			title: nullable(stringArg()),
			content: nullable(stringArg()),
			setPublished: nullable(booleanArg()),
		},
		authorize: (_, { id }, { prisma, session }) =>
			isMyPost({ postId: id, prisma, session }),
		resolve: (_, { id, title, content, setPublished }, { prisma }) => {
			const data = {
				title: title || undefined,
				content: content || undefined,
				published: setPublished === null ? undefined : setPublished,
				publishedAt: setPublished
					? new Date()
					: setPublished === false
					? null
					: undefined,
			}
			return prisma.post.update({
				where: { id },
				data,
			})
		},
	})

	t.field("deletePost", {
		type: "Boolean",
		args: { id: idArg() },
		authorize: (_, { id }, { prisma, session }) =>
			isMyPost({ postId: id, prisma, session }),
		resolve: async (_, { id }, { prisma }) => {
			try {
				await prisma.post.delete({ where: { id } })
				return true
			} catch (error) {
				console.error(error)
				throw new Error("Error deleting post")
			}
		},
	})
})
