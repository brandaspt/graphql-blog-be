import { idArg, mutationField, objectType, stringArg } from "nexus"
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

export const publishPost = mutationField("publishPost", {
	type: PostType,
	args: {
		id: idArg(),
	},
	authorize: (_, { id }, { prisma, session }) =>
		isMyPost({ postId: id, prisma, session }),
	resolve: (_, { id }, { prisma }) =>
		prisma.post.update({
			where: { id },
			data: { published: true, publishedAt: new Date() },
		}),
})
