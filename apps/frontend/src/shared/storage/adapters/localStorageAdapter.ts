import type { IStorageAdapter } from "../index";

export class LocalStorageAdapter implements IStorageAdapter {
	constructor(private storage = localStorage) {}
	async getItem<T>(key: string): Promise<T | null> {
		const value: string | null = this.storage.getItem(key);

		if (!value) {
			return null;
		}

		return JSON.parse(value);
	}

	async setItem(key: string, value: unknown): Promise<void> {
		this.storage.setItem(key, JSON.stringify(value));
	}

	async removeItem(key: string): Promise<void> {
		this.storage.removeItem(key);
	}

	async clear(): Promise<void> {
		this.storage.clear();
	}
}
