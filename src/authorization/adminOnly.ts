import { Context } from "../context"
import { isAdmin } from "../utils"

export const adminOnly = async ({
	prisma,
	session,
}: Pick<Context, "prisma" | "session">) => {
	if (!session?.userId) return false
	const userMe = await prisma.user.findFirst({
		where: { id: session.userId },
	})
	return isAdmin(userMe?.role)
}
