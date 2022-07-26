import * as allTypes from "./types"
import path from "path"
import { makeSchema } from "nexus"

export const getSchema = () =>
	makeSchema({
		types: allTypes,
		outputs: {
			schema: path.join(process.cwd(), "nexus", "schema.graphql"),
			typegen: path.join(process.cwd(), "nexus", "nexus.ts"),
		},
	})
