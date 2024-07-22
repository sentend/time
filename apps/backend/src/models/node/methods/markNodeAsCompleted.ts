import { db } from "@/db";
import { Node, User, Workspace, nodeTable } from "@/models";
import { eq } from "drizzle-orm";

export type MarkNodeCompletedValues = {
	isCompleted: boolean;
	updatedAt: Date;
};

export default async (
	workspace: Workspace,
	nodeId: Node["id"],
	values: MarkNodeCompletedValues,
	currentUser: User,
) => {
	const node = await db.update(nodeTable).set(values).where(eq(nodeTable.id, nodeId)).returning();

	return node;
};
