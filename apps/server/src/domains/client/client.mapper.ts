import type { Client } from "./client.entity";
import type { ClientModel } from "./type/client.model";

export class ClientMapper {
	public static toDomain(entity: Client): ClientModel {
		return entity;
	}
}
