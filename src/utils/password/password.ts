import argon2 from "argon2"

export const hashPassword = (plain: string) => argon2.hash(plain)
export const verifyPassword = ({
	plain,
	hashed,
}: {
	plain: string
	hashed: string
}) => argon2.verify(hashed, plain)
