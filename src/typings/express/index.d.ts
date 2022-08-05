import { UserModel } from "@prisma/client"

declare global {
	namespace Express {
		interface User extends UserModel {}
	}
}
