import apiClient from "../api/ApiClient.ts";
import "@tanstack/react-table";

export * from "./prettify.ts";

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
