import { Prisma } from "@prisma/client"

interface PostsFilter {
	authorIds?: string[]
	searchQuery?: string
	published?: boolean
	unpublished?: boolean
}

export const postsFilterWhereClause = ({
	authorIds,
	searchQuery,
	published,
	unpublished,
}: PostsFilter): Prisma.PostModelWhereInput => {
	let publishedFilter
	if (published && !unpublished) publishedFilter = { published: true }
	else if (unpublished && !published) publishedFilter = { published: false }
	else publishedFilter = {}

	return {
		AND: [
			publishedFilter,
			searchQuery
				? {
						OR: [
							{
								content: {
									contains: searchQuery,
									mode: "insensitive",
								},
							},
							{
								title: {
									contains: searchQuery,
									mode: "insensitive",
								},
							},
						],
				  }
				: {},
			authorIds?.length
				? {
						authorId: {
							in: authorIds,
						},
				  }
				: {},
		],
	}
}
