import { defineConfig } from "drizzle-kit";
import { databaseCredentials } from "./src/config";

console.log(process.env.USERNAME);
export default defineConfig({
	schema: "./src/domains/**/index.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	strict: true,
	verbose: true,
	dbCredentials: databaseCredentials,
});
