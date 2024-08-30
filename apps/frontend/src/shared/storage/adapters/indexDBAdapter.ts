import type { IStorageAdapter } from "..";

export class IndexDB implements IStorageAdapter {
	private db: Promise<IDBDatabase>;
	constructor(readonly name: string, readonly version: number, readonly storeName: string) {
		this.db = this.connection();
	}

	connection() {
		const result = new Promise<IDBDatabase>((res, rej) => {
			const request = indexedDB.open(this.name, this.version);

			let db: IDBDatabase;

			request.onupgradeneeded = () => {
				db = request.result;
				db.createObjectStore(this.storeName, { keyPath: "id" });
			};

			request.onerror = () => {
				console.error("Why didn't you allow my web app to use IndexedDB?!");
				rej();
			};

			request.onsuccess = () => {
				db = request.result;
				console.log("indexDB successfully opened");

				db.onversionchange = () => {
					db.close();
					//todo добавить нотификейшен, что дб устарела и обновить стр
				};

				res(request.result);
			};

			request.onblocked = function () {
				console.error("indexdb connection is blocked");
				rej();
			};
		});

		return result;
	}

	async clear(): Promise<void> {
		const db = await this.db;
		return new Promise((res, rej) => {
			const trx = db.transaction(this.storeName, "readwrite");
			const store = trx.objectStore(this.storeName);
			const request = store.clear();

			request.onsuccess = () => res();
			request.onerror = () => rej(request.error);
		});
	}
	async getItem<T>(key: string): Promise<T | null> {
		const db = await this.db;
		return new Promise((res, rej) => {
			const trx = db.transaction(this.storeName, "readonly");
			const store = trx.objectStore(this.storeName);
			const request = store.get(key);

			request.onsuccess = () => res(request.result ?? null);
			request.onerror = () => rej(request.error);
		});
	}

	async setItem(key: string, value: unknown): Promise<void> {
		const db = await this.db;
		return new Promise((res, rej) => {
			const trx = db.transaction(this.storeName, "readwrite");
			const store = trx.objectStore(this.storeName);
			const request = store.put(value, key);

			request.onsuccess = () => res();
			request.onerror = () => rej(request.error);
		});
	}

	async removeItem(key: string): Promise<void> {
		const db = await this.db;
		return new Promise((res, rej) => {
			const trx = db.transaction(this.storeName, "readwrite");
			const store = trx.objectStore(this.storeName);
			const request = store.delete(key);

			request.onsuccess = () => res();
			request.onerror = () => rej(request.error);
		});
	}
}
