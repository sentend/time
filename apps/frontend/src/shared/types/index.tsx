import { apiClient } from "../api/api-client.ts";
import "@tanstack/react-table";

declare global {
	interface Window {
		store: Record<string, unknown>;
		api: typeof apiClient;
	}
}

declare module "@tanstack/react-table" {
	/* eslint-disable */
	interface ColumnMeta<TData extends unknown, TValue> {
		cell?: {
			className?: string;
		};

		header?: {
			className?: string;
		};
	}
}
