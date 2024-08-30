// import { eq } from "drizzle-orm";
// import { db } from "@/db";
// import { toTProject } from ".";

// export default async (
// 	workspace: Workspace,
// 	projectId: string,
// 	values: Omit<NewProjectData, "createdBy">,
// 	currentUser: User,
// ) => {
// 	const { members, ...rest } = values;
// 	await db
// 		.update(projectTable)
// 		.set({ ...rest, updatedAt: new Date() })
// 		.where(eq(projectTable.id, projectId));

// 	const currentMemberIds = (
// 		await db.query.userProjectTable.findMany({
// 			where(fields, { eq, and }) {
// 				return eq(fields.projectId, projectId);
// 			},
// 			columns: {
// 				userId: true,
// 			},
// 		})
// 	).map(member => member.userId);

// 	const newMmebers = members
// 		?.filter(member => !currentMemberIds.includes(member.id))
// 		.map(member => ({
// 			isManager: member.isManager,
// 			projectId: projectId,
// 			userId: member.id,
// 		}));

// 	if (newMmebers?.length) {
// 		await db.insert(userProjectTable).values(newMmebers!).execute();
// 	}

// 	const project = await db.query.projectTable.findFirst({
// 		where(fields, { eq }) {
// 			return eq(fields.id, projectId);
// 		},
// 		with: {
// 			members: {
// 				with: {
// 					user: true,
// 				},
// 			},
// 			client: true,
// 		},
// 	});

// 	return toTProject(project!);
// };
