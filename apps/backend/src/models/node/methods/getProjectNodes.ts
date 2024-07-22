import { db } from "@/db";
import doNothing from "@/db/helpers";
import { NodeType, nodeTable } from "@/models";
import { toTNode } from "@/models/node/methods";
import { and, eq, ilike, isNull, not } from "drizzle-orm";
import isNil from "lodash/isNil";

export type ProjectNodesFilters = {
	q: string;
	isCompleted?: boolean;
};

export default async (projectId: string, filters: ProjectNodesFilters) => {
	const { q, isCompleted } = filters;

	const sq = db
		.select({ id: nodeTable.id })
		.from(nodeTable)
		.where(
			and(
				not(nodeTable.isDeleted),
				eq(nodeTable.projectId, projectId),
				ilike(nodeTable.name, q),
				isNull(nodeTable.parentId),
				eq(nodeTable.type, NodeType.folder),
			),
		);

	const nodes = await db.query.nodeTable.findMany({
		where(fields, { and, ilike, isNull, not, or, inArray }) {
			return and(
				not(fields.isDeleted),
				eq(fields.projectId, projectId),
				isNil(isCompleted) ? doNothing() : eq(fields.isCompleted, isCompleted),
				q
					? or(
							and(ilike(fields.name, q), isNull(fields.parentId)),
							and(inArray(fields.parentId, sq)),
						)
					: doNothing(),
			);
		},
		orderBy(fields, { desc, asc }) {
			return [desc(fields.parentId), asc(fields.order), desc(fields.type)];
		},
	});

	return nodes.map(node => toTNode(node));
};
