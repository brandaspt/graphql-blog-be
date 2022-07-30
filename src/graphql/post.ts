import {
	booleanArg,
	idArg,
	mutationField,
	nullable,
	objectType,
	stringArg,
} from "nexus"
import { adminOnly, isMyPost } from "../authorization"
import { UserType } from "./user"

export const PostType = objectType({
	name: "Post",
	definition(t) {
		t.id("id")
		t.string("title")
		t.string("content")
		t.id("authorId")
		t.field("author", {
			type: UserType,
			resolve: async ({ authorId }, _, { prisma }) =>
				prisma.user.findFirstOrThrow({ where: { id: authorId } }),
		})
		t.date("createdAt")
		t.date("updatedAt")
		t.nullable.date("publishedAt")
		t.boolean("published")
	},
})

export const createPost = mutationField("createPost", {
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

export const updatePost = mutationField("updatePost", {
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

export const deletePost = mutationField("deletePost", {
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
