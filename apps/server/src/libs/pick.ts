import type { Prettify } from "~types/supportTypes";

export function pick<T extends K, K extends object>(
	object: T,
	keys: (keyof K)[],
): Prettify<K> {
	const result = {} as K;

	for (const key of keys) {
		if (object && key in object) {
			result[key] = object[key];
		}
	}

	return result;
}

// const test = {
// 	a: 1,
// 	b: 23,
// 	d: "q",
// };

// type PickKeys<T> = {
// 	[K in keyof T]?: boolean;
// };

// const p = <T extends object, U = T>(object: T, keys: PickKeys<U>) => {
// 	const result = {} as {
// 		[K in keyof U as U[K] extends true ? K : never]: T[K];
// 	};

// 	for (const [key, value] of Object.entries(object)) {
// 		if (key in keys) {
// 			result[key as keyof typeof keys] = value;
// 		}
// 	}

// 	return result;
// };

// const a = p<typeof test, { d: string }>(test, { d: true });
