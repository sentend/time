import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
	schema: "./src/models/index.ts",
	out: "./src/db/migrations",
	driver: "pg",
	dbCredentials: {
		database: process.env.DATABASE as string,
		host: process.env.HOST as string,
		port: Number(process.env.DB_PORT),
		password: process.env.PASSWORD as string,
		user: process.env.USER as string,
	},
} satisfies Config;
