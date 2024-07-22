import { drizzle } from "drizzle-orm/node-postgres";
import * as schemas from "../models";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new pg.Client({
	database: process.env.DATABASE,
	host: process.env.HOST,
	port: Number(process.env.DB_PORT),
	password: process.env.PASSWORD,
	user: process.env.USER,
});

client.connect();

export const db = drizzle(client, { schema: schemas });
