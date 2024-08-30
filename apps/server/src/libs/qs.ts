import qs from "query-string";
import type { Maybe } from "~types/supportTypes";

export class QS {
	public static parse(string: Maybe<string>) {
		if (!string) {
			return undefined;
		}

		return qs.parse(string, { parseBooleans: true, parseNumbers: true });
	}

	// public static stringify(value: string) {
	// 	return qs.stringify(value);
	// }
}
