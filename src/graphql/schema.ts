import * as allTypes from "./types"
import path from "path"
import { connectionPlugin, fieldAuthorizePlugin, makeSchema } from "nexus"

export const getSchema = () =>
	makeSchema({
		types: allTypes,
		outputs: {
			schema: path.join(process.cwd(), "src", "nexus", "schema.graphql"),
			typegen: path.join(process.cwd(), "src", "nexus", "nexus-typegen.ts"),
		},
		nonNullDefaults: {
			output: true,
			input: true,
		},
		contextType: {
			module: path.join(process.cwd(), "src", "context.ts"),
			export: "Context",
		},
		plugins: [
			fieldAuthorizePlugin(),
			connectionPlugin({
				disableBackwardPagination: true,
			}),
		],
	})
