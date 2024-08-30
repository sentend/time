import { db } from "@/db";
import type { ClientModel } from "./type/client.model";
import { ClientMapper } from "./client.mapper";

export interface ClientRepository {
	getAll(): Promise<ClientModel[]>;
}

export class ClientRepositoryImpl implements ClientRepository {
	async getAll() {
		const clients = await db.query.clientTable.findMany();

		return clients.map(ClientMapper.toDomain);
	}
}
