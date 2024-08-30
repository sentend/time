import { ClientRepositoryImpl, type ClientRepository } from "./client.repository";

// для бизнес логики, валидации данных и прочее
class ClientService {
	constructor(readonly clientRepositry: ClientRepository) {}

	async getAll() {}

	async getById(id: string) {}

	async createNewClient() {}
}

export const clientService = new ClientService(new ClientRepositoryImpl());
