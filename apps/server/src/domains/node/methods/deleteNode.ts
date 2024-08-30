import { db } from "@/db";
import { NodeType, nodeTable, timeEntryTable } from "@/models";
import { eq } from "drizzle-orm";
import { toTNode } from ".";

export default async (nodeId: string) => {
	console.log("method", nodeId);
	const node = await db.query.nodeTable.findFirst({
		where(fields, { eq }) {
			return eq(fields.id, nodeId);
		},
		columns: {
			type: true,
			id: true,
		},
	});

	//?move to service
	if (!node?.id) {
		throw new Error("nodeNotExist");
	}

	console.log(node);

	const res = await db.transaction(async tx => {
		const isFolder = node.type === NodeType.folder;

		const folderPromises = [];
		if (isFolder) {
			folderPromises.push(tx.delete(nodeTable).where(eq(nodeTable.parentId, nodeId)));
		}

		const results = await Promise.allSettled([
			tx
				.update(nodeTable)
				.set({ isDeleted: true, updatedAt: new Date() })
				.where(eq(nodeTable.id, nodeId))
				.returning(),
			tx.delete(timeEntryTable).where(eq(timeEntryTable.taskId, nodeId)),
			...folderPromises,
		]);

		const isAnyRejected = results.some(res => res.status === "rejected");
		if (isAnyRejected) {
			tx.rollback();
			return;
		}

		return results[0].status === "fulfilled" ? results[0].value[0] : undefined;
	});

	return toTNode(res!);
};
