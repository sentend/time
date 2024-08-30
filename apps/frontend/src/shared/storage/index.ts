import { LocalStorageAdapter } from "./adapters/localStorageAdapter";

export interface IStorageAdapter {
	setItem(key: string, value: unknown): Promise<void>;
	getItem<T>(key: string): Promise<T | null>;
	removeItem(key: string): Promise<void>;
	clear(): Promise<void>;
}

export class Storage {
	constructor(private storage: IStorageAdapter) {}

	async getItem<T>(key: string): Promise<T | null> {
		const value: string | null = await this.storage.getItem(key);
		if (!value) {
			return null;
		}

		return JSON.parse(value);
	}

	async setItem(key: string, value: unknown) {
		this.storage.setItem(key, JSON.stringify(value));
	}

	async removeItem(key: string) {
		this.storage.removeItem(key);
	}

	async clear() {
		this.storage.clear();
	}
}

export const storage = new Storage(new LocalStorageAdapter());
