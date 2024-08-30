import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/domains/**/index.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	strict: true,
	verbose: true,
	dbCredentials: {
		host: process.env.HOST!,
		port: Number(process.env.DB_PORT!),
		password: process.env.PASSWORD!,
		user: process.env.USER!,
		database: process.env.DATABASE!,
		ssl: false,
	},
});
