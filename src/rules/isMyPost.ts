import { PrismaClient } from "@prisma/client"
import { MySession } from "../context"

export const isMyPost = async ({
	prisma,
	postId,
	session,
}: {
	prisma: PrismaClient
	postId: string
	session: MySession
}) => {
	const post = await prisma.postModel.findUniqueOrThrow({
		where: { id: postId },
	})
	return post.authorId === session.userId
}
