import { drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";
import { faker } from "@faker-js/faker";
import { clientTable, workspaceTable } from "@/models";
import * as dotenv from "dotenv";
import * as path from "path";
import * as schemas from "@/models";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const main = async () => {
	const client = new Client({
		database: process.env.DATABASE,
		host: process.env.HOST,
		port: Number(process.env.DB_PORT),
		password: process.env.PASSWORD,
		user: process.env.USER,
	});

	await client.connect();

	const db = drizzle(client, { schema: schemas });
	const workspace = await db.query.workspaceTable.findFirst({
		where(fields, { eq }) {
			return eq(fields.id, 25);
		},
		columns: { id: true },
	});

	if (!workspace) {
		throw new Error("no workspace id provided");
	}

	//clients
	// const clients: (typeof clientTable.$inferInsert)[] = [];

	// for (let i = 0; i < 12; i++) {
	// 	clients.push({
	// 		name: faker.company.name(),
	// 		workspaceId: workspace.id,
	// 	});
	// }
	// await db.insert(clientTable).values(clients);

	//users
	const users: (typeof schemas.userTable.$inferInsert)[] = [];

	for (let i = 0; i < 12; i++) {
		const name = faker.person.firstName();
		const lastName = faker.person.lastName();
		users.push({
			name: name + " " + lastName,
			email: faker.internet.email(),
			passwordHash: faker.internet.password(),
			initials: name.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase(),
		});
	}

	const members = await db
		.insert(schemas.userTable)
		.values(users)
		.returning({ id: schemas.userTable.id });

	const modifiedMember = members.map(member => {
		return { userId: member.id, workspaceId: workspace.id };
	});

	await db.insert(schemas.userWorkspaceTable).values(modifiedMember);

	console.log("Seed successfully done");
	process.exit();
};

main();
