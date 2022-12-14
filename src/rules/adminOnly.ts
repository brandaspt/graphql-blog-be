import { Context } from "../context"
import { isAdmin } from "../utils"

export const adminOnly = async ({
	prisma,
	session,
}: Pick<Context, "prisma" | "session">) => {
	const userMe = await prisma.userModel.findUniqueOrThrow({
		where: { id: session.userId },
	})
	return isAdmin(userMe?.role)
}
