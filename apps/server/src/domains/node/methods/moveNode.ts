import { db } from "@/db";
import { Node, User, Workspace, nodeTable } from "@/models";
import ApiError from "@/utils/ApiError";
import { and, arrayOverlaps, eq, inArray, isNotNull, isNull, notInArray, or } from "drizzle-orm";
import { Nullable } from "~types/supportTypes";

export type MoveNodeValues = { order?: string; parentId?: string | null };

type Parent = Nullable<{
	id: Node["id"];
	colorId: Node["colorId"];
	cachedColorId: Node["cachedColorId"];
	parentIds: Node["parentIds"];
}>;

export default async (
	nodeId: string,
	values: MoveNodeValues,
) => {
	console.log(values);
	const { parentId } = values;
	let parent: Parent | undefined = null;
	if (parentId) {
		parent = await db.query.nodeTable.findFirst({
			where(fields, { eq }) {
				return eq(fields.id, parentId);
			},
			columns: {
				id: true,
				colorId: true,
				cachedColorId: true,
				parentIds: true,
			},
		});
	}

	const currentNode = await db.query.nodeTable.findFirst({
		where(fields, { eq }) {
			return eq(fields.id, nodeId);
		},
		columns: {
			id: true,
			parentIds: true,
			colorId: true,
		},
		with: {
			project: {
				columns: {
					colorId: true,
				},
			},
		},
	});

	const updatedNode = db.transaction(async tx => {
		const parentIds = [...(parent?.parentIds || []), parent?.id ?? ""];

		const results = await Promise.all([
			//update current/moved node
			db
				.update(nodeTable)
				.set({
					...values,
					cachedColorId:
						currentNode?.colorId ??
						parent?.colorId ??
						parent?.cachedColorId ??
						currentNode?.project?.colorId,
					updatedAt: new Date(),
					parentIds,
				})
				.where(eq(nodeTable.id, nodeId))
				.returning({
					id: nodeTable.id,
					parentIds: nodeTable.parentIds,
					parentId: nodeTable.parentId,
					colorId: nodeTable.colorId,
					cachedColorId: nodeTable.cachedColorId,
				}),
			//get all childrens of current node where ↓
			db
				.select({
					id: nodeTable.id,
					parentIds: nodeTable.parentIds,
					parentId: nodeTable.parentId,
					colorId: nodeTable.colorId,
				})
				.from(nodeTable)
				.where(
					and(
						//where any node contain current node id in parent ids
						arrayOverlaps(nodeTable.parentIds, [currentNode!.id]),
					),
				),
		]);

		if (!Array.isArray(results)) {
			tx.rollback();
			return;
		}

		const [[updatedNode], childs] = results;

		console.log("all childs", childs);

		//all nodes with current/moved node in parentIds and colorId NULL **if node has colorId we dont need to update cachedColorId**
		const nodesForUpdateColor = await db
			.select({ id: nodeTable.id })
			.from(nodeTable)
			.where(
				and(
					arrayOverlaps(nodeTable.parentIds, [currentNode!.id]),
					isNull(nodeTable.colorId),
				),
			);

		const nodeIdsForUpdateColor = nodesForUpdateColor.map(node => node.id);

		const oldParentIds = currentNode!.parentIds;

		const promises = childs.map(child => {
			let newParentIds =
				child.parentIds?.filter(parentId => !oldParentIds?.includes(parentId)) || [];
			newParentIds = [...newParentIds, ...(updatedNode.parentIds || [])];

			let newColor = undefined;
			if (nodeIdsForUpdateColor.includes(child.id)) {
				newColor = updatedNode.colorId ?? updatedNode.cachedColorId;
			}

			return db
				.update(nodeTable)
				.set({
					cachedColorId: newColor,
					parentIds: newParentIds,
				})
				.where(and(eq(nodeTable.id, child.id)))
				.execute();
		});
		const res = await Promise.all(promises);

		if (!Array.isArray(res)) {
			tx.rollback();
			return;
		}

		return updatedNode;
	});

	return updatedNode;
};
