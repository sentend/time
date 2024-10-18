import type { BinaryLike } from "crypto";
import type { ClientConfig } from "pg";

export const databaseCredentials = {
	database: process.env.DB_NAME!,
	host: process.env.DB_HOST!,
	port: Number(process.env.DB_PORT)!,
	password: process.env.DB_PASSWORD!,
	user: process.env.DB_USER!,
	ssl: false,
} satisfies ClientConfig;

console.log(databaseCredentials);

export const serverConfig = {
	apiVersion: process.env.API_VERSION || "/v1",
	hostname: process.env.API_HOST || "localhost",
	port: Number(process.env.API_PORT) || 3000,
} as const;

export const NUMBER_OF_COLORS = Number(18);

export const NODE_ENV = process.env.NODE_ENV;

export const SALT = process.env.SALT as BinaryLike;
