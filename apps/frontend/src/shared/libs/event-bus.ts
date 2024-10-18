export type Listener = (...args: unknown[]) => void;

export class EventBus {
	private listeners = new Map<string, Set<Listener>>();

	private constructor() {}

	subscribe<T extends Listener>(eventName: string, listener: T) {
		if (!this.listeners.has(eventName)) {
			this.listeners.set(eventName, new Set());
		}

		const eventListeners = this.listeners.get(eventName);

		eventListeners?.add(listener);

		return () => {
			eventListeners?.delete(listener);
		};
	}

	emit<T extends Listener>(eventName: string, ...args: Parameters<T>) {
		this.listeners.get(eventName)?.forEach((listener) => listener(...args));
	}
}
