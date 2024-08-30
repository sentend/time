import { db } from "@/db";
import { nodeTable } from "@/models";
import { toTNode } from ".";
import { Nullable } from "~types/supportTypes";
import ApiError from "@/utils/ApiError";

export type NodeValues = {
	parentId: Nullable<string>;
	name: string;
	projectId: string;
};

export default async (values: NodeValues) => {
	const { parentId, projectId } = values;

	console.log("projectId", projectId);
	

	let parent = null;
	if (parentId) {
		parent = await db.query.nodeTable.findFirst({
			where(fields, { eq }) {
				return eq(fields.id, parentId);
			},
			columns: {
				id: true,
				parentIds: true,
				colorId: true,
				cachedColorId: true,
			},
		});
	}

	const project = await db.query.projectTable.findFirst({
		where(fields, { eq }) {
			return eq(fields.id, projectId);
		},
		columns: {
			id: true,
			colorId: true,
		},
	});

	if (!project) {
		throw new ApiError("NoSuchProject", 404);
	}

	const node = await db.query.nodeTable.findFirst({
		columns: {
			order: true,
		},
		where(fields, { eq, isNull, and }) {
			return and(
				eq(fields.projectId, projectId),
				parentId ? eq(fields.parentId, parentId) : isNull(fields.parentId),
				eq(fields.isDeleted, false),
			);
		},
		orderBy(fields, { desc }) {
			return desc(fields.order);
		},
	});

	let order = nodeTable.order.default;
	if (node?.order !== undefined) {
		order = String(Number(node.order) + 100);
	}

	const [newNode] = await db
		.insert(nodeTable)
		.values({
			...values,
			order,
			parentIds: [...(parent?.parentIds || []), parent?.id ?? ""],
			cachedColorId: parent?.colorId ?? parent?.cachedColorId ?? project.colorId,
		})
		.returning();

	return toTNode(newNode);
};
